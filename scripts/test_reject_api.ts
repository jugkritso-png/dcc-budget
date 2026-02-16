
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Testing API Endpoint: /requests/:id/reject-expense");

    try {
        // 1. Setup
        const category = await prisma.category.create({
            data: {
                name: "ApiTest " + Date.now(),
                code: "API" + Date.now(),
                segment: "Test",
                allocated: 1000,
                year: 2569,
                color: "red",
                colorLabel: "Red"
            }
        });

        const request = await prisma.budgetRequest.create({
            data: {
                project: "API Test Project",
                category: category.name,
                amount: 1000,
                status: "waiting_verification",
                requester: "Admin",
                date: "2026-02-10",
                actualAmount: 500,
                returnAmount: 500
            }
        });

        console.log(`Created Request: ${request.id}`);

        // 2. Call API
        const response = await fetch(`http://localhost:3002/api/requests/${request.id}/reject-expense`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: "Testing API" })
        });

        console.log(`Response Status: ${response.status}`);

        if (response.ok) {
            const json = await response.json();
            console.log("Response JSON:", json);
            if (json.status === 'approved') {
                console.log("SUCCESS: API updated status to approved.");
            } else {
                console.error("FAILED: API returned success but status is " + json.status);
            }
        } else {
            const text = await response.text();
            console.error("FAILED: API Error:", text);
        }

        // Cleanup
        await prisma.budgetRequest.delete({ where: { id: request.id } });
        await prisma.category.delete({ where: { id: category.id } });

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
