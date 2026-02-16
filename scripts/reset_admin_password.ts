
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.update({
            where: { username: 'admin' },
            data: { password: hashedPassword },
        });
        console.log(`Password for user '${user.username}' has been reset to 'password123'`);
    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
