const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
    const { data, error } = await supabaseAdmin.from('User').select('id, email, role');
    console.log("Users in public.User:", data);
    
    for (const u of data) {
        console.log(`Syncing ${u.email} to role ${u.role}`);
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            u.id,
            { user_metadata: { role: u.role } }
        );
        if (authError) {
            console.error("Failed to update auth user for", u.email, authError);
            
            // Try by email if ID mismatch
            const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
            const matchingAuth = authUsers.users.find(x => x.email === u.email);
            if (matchingAuth) {
                 await supabaseAdmin.auth.admin.updateUserById(
                    matchingAuth.id,
                    { user_metadata: { role: u.role } }
                );
                console.log("Synced by email fallback for", u.email);
            }
        } else {
            console.log("Synced successfully for", u.email);
        }
    }
}
sync();
