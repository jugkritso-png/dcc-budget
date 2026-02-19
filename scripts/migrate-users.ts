import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://lflhxsxubxymxpnxeqts.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g'
);

// Default password for all migrated users (they should change after first login)
const DEFAULT_PASSWORD = 'DCC@2026!';

async function migrateUsers() {
    console.log('📋 Fetching all users from User table...\n');

    const { data: users, error } = await supabase
        .from('User')
        .select('id, username, email, name, role')
        .order('createdAt', { ascending: true });

    if (error || !users) {
        console.error('❌ Failed to fetch users:', error?.message);
        return;
    }

    console.log(`Found ${users.length} users:\n`);

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const user of users) {
        if (!user.email) {
            console.log(`⏭️  [SKIP] ${user.username} — no email`);
            skipped++;
            continue;
        }

        // Try to sign up in Supabase Auth
        const { data, error: signupError } = await supabase.auth.signUp({
            email: user.email,
            password: DEFAULT_PASSWORD,
            options: {
                data: {
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    migrated: true,
                }
            }
        });

        if (signupError) {
            if (signupError.message.includes('already registered')) {
                console.log(`⏭️  [EXISTS] ${user.username} (${user.email}) — already in Supabase Auth`);
                skipped++;
            } else {
                console.log(`❌ [FAIL] ${user.username} (${user.email}) — ${signupError.message}`);
                failed++;
            }
        } else {
            console.log(`✅ [OK] ${user.username} (${user.email}) — role: ${user.role}`);
            success++;
        }

        // Sign out between signups to avoid session conflicts
        await supabase.auth.signOut();
    }

    console.log('\n========================================');
    console.log(`Migration complete!`);
    console.log(`  ✅ Created: ${success}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`\n  Default password: ${DEFAULT_PASSWORD}`);
    console.log(`  ⚠️  Users should change their password after first login!`);
    console.log('========================================');
}

migrateUsers();
