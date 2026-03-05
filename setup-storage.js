const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env.local'});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function setup() {
    // 1. Create Bucket
    const { data, error } = await supabaseAdmin.storage.createBucket('attachments', {
        public: true, // Making public for easier viewing if they have the long URL, or we can make it false. Let's start with true to avoid complex signed URL logic for now, or false if it's sensitive. Let's make it true for simplicity.
        fileSizeLimit: 10485760, // 10MB
    });
    
    if (error && error.message !== 'The resource already exists') {
        console.error("Error creating bucket:", error);
    } else {
        console.log("Bucket 'attachments' ready.");
    }

    // Since we use public bucket, we still need RLS to allow INSERT/UPDATE/DELETE.
    // However, the service_role key bypasses RLS, so bucket creation is fine.
    // Using SQL to add policies for the actual client usage.
}
setup();
