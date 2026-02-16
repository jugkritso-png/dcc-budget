
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Budget Verification Simulation...");

    // 1. Setup Data
    const category = await prisma.category.create({
        data: {
            name: "Test Cat " + Date.now(),
            code: "TC" + Date.now(),
            segment: "Test",
            allocated: 10000,
            used: 0,
            color: "red",
            colorLabel: "Red",
            year: 2569
        }
    });

    const subActivity = await prisma.subActivity.create({
        data: {
            name: "Test Sub " + Date.now(),
            allocated: 5000,
            categoryId: category.id
        }
    });

    // 2. Create Request (1000)
    console.log("Creating Request for 1000...");
    const request = await prisma.budgetRequest.create({
        data: {
            project: "Test Project",
            category: category.name,
            subActivityId: subActivity.id,
            amount: 1000,
            date: "2026-02-10",
            requester: "Admin User",
            status: "pending"
        }
    });

    // Check Usage (Should be 1000 for Sub, 0 for Cat)
    let subUsage = await getSubUsage(subActivity.id);
    let cat = await prisma.category.findUnique({ where: { id: category.id } });
    console.log(`[After Create] Sub Used: ${subUsage} (Expected 1000), Cat Used: ${cat?.used} (Expected 0)`);

    // 3. Approve Request
    console.log("Approving Request...");
    // Update Request Status
    await prisma.budgetRequest.update({ where: { id: request.id }, data: { status: 'approved' } });
    // Update Category Used
    await prisma.category.update({ where: { id: category.id }, data: { used: { increment: 1000 } } });

    subUsage = await getSubUsage(subActivity.id);
    cat = await prisma.category.findUnique({ where: { id: category.id } });
    console.log(`[After Approve] Sub Used: ${subUsage} (Expected 1000), Cat Used: ${cat?.used} (Expected 1000)`);

    // 4. Submit Expense (Actual: 800, Return: 200)
    console.log("Submitting Expense (Actual 800)...");
    await prisma.budgetRequest.update({
        where: { id: request.id },
        data: {
            status: 'waiting_verification',
            actualAmount: 800,
            returnAmount: 200
        }
    });

    subUsage = await getSubUsage(subActivity.id);
    cat = await prisma.category.findUnique({ where: { id: category.id } });
    console.log(`[After Submit] Sub Used: ${subUsage} (Expected 800 - Immediate Release?), Cat Used: ${cat?.used} (Expected 1000 - No Release Yet)`);

    // 5. Complete Request
    console.log("Completing Request...");
    await prisma.budgetRequest.update({
        where: { id: request.id },
        data: { status: 'completed' }
    });
    // Return Funds to Category
    await prisma.category.update({ where: { id: category.id }, data: { used: { decrement: 200 } } });

    subUsage = await getSubUsage(subActivity.id);
    cat = await prisma.category.findUnique({ where: { id: category.id } });
    console.log(`[After Complete] Sub Used: ${subUsage} (Expected 800), Cat Used: ${cat?.used} (Expected 800)`);

    // Cleanup
    await prisma.budgetRequest.delete({ where: { id: request.id } });
    await prisma.subActivity.delete({ where: { id: subActivity.id } });
    await prisma.category.delete({ where: { id: category.id } });
}

async function getSubUsage(subId: string) {
    const aggregations = await prisma.budgetRequest.aggregate({
        _sum: { amount: true, returnAmount: true },
        where: {
            subActivityId: subId,
            status: { not: 'rejected' }
        }
    });
    return (aggregations._sum.amount || 0) - (aggregations._sum.returnAmount || 0);
}

main().catch(console.error).finally(() => prisma.$disconnect());
