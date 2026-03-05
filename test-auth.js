const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function test() {
    console.log("Testing with admin / admin1234 (Assuming)");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'jugkrit.so@gmail.com', // Let's try to query info 
        password: 'password' // We don't know password
    });
    
    // Just find the user in auth.users by email using admin client
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if(users && users.users) {
        const u = users.users.find(x => x.email === 'jugkrit.so@gmail.com' || x.email === 'admin@wu.ac.th');
        console.log("Auth User Found:", u ? {id: u.id, email: u.email} : "Not found");
        
        if (u) {
           const {data: pubUser} = await supabaseAdmin.from('User').select('*').eq('id', u.id);
           console.log("Public User by ID:", pubUser);
           
           const {data: pubUserEmail} = await supabaseAdmin.from('User').select('*').eq('email', u.email);
           console.log("Public User by Email:", pubUserEmail);
        }
    } else {
        console.log("list error", listError);
    }
}
test();
