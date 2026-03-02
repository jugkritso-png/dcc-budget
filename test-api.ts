import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from './server/lib/supabase.js';

async function verify() {
    const { data: user } = await supabase.from('User').select('*').eq('username', 'admin').single();
    console.log("Admin exists?", !!user);
    if (user) {
        const isMatch = await bcrypt.compare('password123', user.password);
        console.log("Password match 'password123'?", isMatch);
    } else {
        console.log("Admin does not exist.");
    }
}
verify();
