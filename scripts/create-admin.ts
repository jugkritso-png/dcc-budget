import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
    'https://lflhxsxubxymxpnxeqts.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g'
);

async function main() {
    // Check if admin user already exists
    const { data: existing } = await supabase
        .from('User')
        .select('*')
        .eq('username', 'admin')
        .single();

    if (existing) {
        console.log('Found existing admin user:', existing.id, existing.email);
        // Update email and role if needed
        const { error } = await supabase
            .from('User')
            .update({ role: 'admin', email: 'admin@dcc.co.th' })
            .eq('id', existing.id);
        if (error) console.error('Update error:', error.message);
        else console.log('Updated to admin role with email admin@dcc.co.th');
    } else {
        // Create new admin user
        const now = new Date().toISOString();
        const { data, error } = await supabase.from('User').insert({
            id: randomUUID(),
            username: 'admin',
            email: 'admin@dcc.co.th',
            name: 'System Admin',
            password: 'supabase-auth-managed',
            role: 'admin',
            department: 'IT',
            position: 'System Administrator',
            createdAt: now,
            updatedAt: now,
        }).select().single();

        if (error) console.error('Insert error:', error.message);
        else console.log('Created admin:', data.id, data.email);
    }

    // Verify Supabase Auth user exists
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@dcc.co.th',
        password: 'Admin1234!',
    });

    if (authError) {
        console.log('Auth login test failed:', authError.message);
        console.log('Creating Supabase Auth user...');
        const { error: signupErr } = await supabase.auth.signUp({
            email: 'admin@dcc.co.th',
            password: 'Admin1234!',
        });
        if (signupErr) console.error('Signup error:', signupErr.message);
        else console.log('Supabase Auth user created');
    } else {
        console.log('Auth login OK! Session:', authData.session?.access_token?.slice(0, 20) + '...');
    }

    console.log('\n========================================');
    console.log('Admin user ready!');
    console.log('  Email:    admin@dcc.co.th');
    console.log('  Password: Admin1234!');
    console.log('========================================');
}

main();
