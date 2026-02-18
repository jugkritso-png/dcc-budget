import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            name: 'System Administrator',
            email: 'admin@dcc-motor.com',
            role: 'admin',
            position: 'Senior System Administrator',
            department: 'IT Department',
            employeeId: 'EMP-00001',
            bio: 'Responsible for maintaining the DCC Budget Manager system and overseeing all technical operations.',
            phone: '02-123-4567',
            englishName: 'Admin User',
            startDate: '2024-01-01',
            theme: 'light',
            language: 'th'
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'System Administrator',
            email: 'admin@dcc-motor.com',
            role: 'admin',
            position: 'Senior System Administrator',
            department: 'IT Department',
            employeeId: 'EMP-00001',
            bio: 'Responsible for maintaining the DCC Budget Manager system and overseeing all technical operations.',
            phone: '02-123-4567',
            englishName: 'Admin User',
            startDate: '2024-01-01',
            theme: 'light',
            language: 'th'
        },
    });

    console.log('Admin user profile updated:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
