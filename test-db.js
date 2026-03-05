const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://lflhxsxubxymxpnxeqts.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('User').select('*');
    console.log("Users in Supabase DB:", JSON.stringify(data, null, 2));
    if (error) console.error("Error:", error);
}
test();
