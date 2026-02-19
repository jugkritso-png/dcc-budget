
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        console.log('--- Existing Users ---');
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.table(users);
        }
        console.log('----------------------');
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
