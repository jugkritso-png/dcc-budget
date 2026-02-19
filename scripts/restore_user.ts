
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'jugkrit.so@gmail.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log(`User ${email} already exists. Updating password...`);
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
        } else {
            console.log(`Creating user ${email}...`);
            await prisma.user.create({
                data: {
                    username: 'jugkrit',
                    email,
                    password: hashedPassword,
                    name: 'Jugkrit So',
                    role: 'admin', // Assuming they want admin access since they are the developer/owner
                    position: 'Developer',
                    department: 'IT'
                }
            });
        }
        console.log(`User ${email} ready. Password: ${password}`);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
