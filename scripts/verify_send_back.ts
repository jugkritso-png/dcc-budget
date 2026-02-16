
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Send Back Verification...");

    // 1. Setup Data
    const category = await prisma.category.create({
        data: {
            name: "SendBack Test " + Date.now(),
            code: "SB" + Date.now(),
            segment: "Test",
            allocated: 10000,
            year: 2569,
            color: "blue",
            colorLabel: "Blue"
        }
    });

    const request = await prisma.budgetRequest.create({
        data: {
            project: "Send Back Project",
            category: category.name,
            amount: 1000,
            date: "2026-02-10",
            requester: "Tester",
            status: "waiting_verification", // Simulate already submitted
            actualAmount: 800,
            returnAmount: 200
        }
    });

    console.log(`[Before Reject] Status: ${request.status}, Actual: ${request.actualAmount}`);

    // 2. Reject (Send Back)
    console.log("Sending Back...");
    const updated = await prisma.budgetRequest.update({
        where: { id: request.id },
        data: {
            status: 'approved',
            rejectionReason: 'Please fix the receipt'
        }
    });

    console.log(`[After Reject] Status: ${updated.status} (Expected: approved)`);
    console.log(`[After Reject] Actual: ${updated.actualAmount} (Expected: 800 - preserved)`);
    console.log(`[After Reject] Reason: ${updated.rejectionReason}`);

    if (updated.status === 'approved' && updated.actualAmount === 800) {
        console.log("PASSED: Request sent back successfully.");
    } else {
        console.error("FAILED: Status or data mismatch.");
    }

    // Cleanup
    await prisma.budgetRequest.delete({ where: { id: request.id } });
    await prisma.category.delete({ where: { id: category.id } });
}

main().catch(console.error).finally(() => prisma.$disconnect());
