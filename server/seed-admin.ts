import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from './lib/supabase.js';

async function testSeed() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if admin exists
        const { data: existing } = await supabase.from('User').select('id').eq('username', 'admin').maybeSingle();

        if (existing) {
            console.log("Admin exists, updating password...");
            const { error } = await supabase.from('User').update({
                password: hashedPassword
            }).eq('username', 'admin');
            if (error) console.error("Update error:", error);
            else console.log("Admin password reset to 'password123'");
        } else {
            console.log("Creating admin user...");
            const { error } = await supabase.from('User').insert({
                username: 'admin',
                password: hashedPassword,
                name: 'Admin User',
                email: 'admin@dcc-motor.com',
                role: 'admin',
                position: 'System Administrator',
                department: 'IT',
                employeeId: 'EMP-001',
                bio: 'Default System Administrator',
                theme: 'light',
                language: 'th'
            });
            if (error) console.error("Insert error:", error);
            else console.log("Admin created with password 'password123'");
        }

    } catch (e) {
        console.error(e);
    }
}

testSeed();
