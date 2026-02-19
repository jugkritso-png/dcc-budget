import { createClient } from '@supabase/supabase-js';

// Use the direct connection to run raw SQL
const supabase = createClient(
    'https://lflhxsxubxymxpnxeqts.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g'
);

// All tables that need uuid + timestamp defaults
const tablesWithUpdatedAt = [
    'Category', 'Expense', 'SubActivity', 'BudgetPlan',
    'Department', 'BudgetRequest', 'BudgetRequestItem', 'User'
];

const tablesWithCreatedAtOnly = [
    'BudgetLog', 'ActivityLog'
];

async function fixDefaults() {
    console.log('🔧 Adding SQL defaults for id, createdAt, updatedAt...\n');

    // We need to use Supabase SQL editor or rpc for this.
    // Since we can't run raw SQL via the JS client with anon key,
    // we'll generate the SQL and the user can run it in the Supabase dashboard.

    let sql = '-- Run this SQL in Supabase Dashboard > SQL Editor\n';
    sql += '-- This adds defaults so the Supabase SDK can insert without providing id/timestamps\n\n';
    sql += '-- Enable uuid-ossp extension\n';
    sql += 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n';

    for (const table of tablesWithUpdatedAt) {
        sql += `-- ${table}\n`;
        sql += `ALTER TABLE "${table}" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();\n`;
        sql += `ALTER TABLE "${table}" ALTER COLUMN "createdAt" SET DEFAULT now();\n`;
        sql += `ALTER TABLE "${table}" ALTER COLUMN "updatedAt" SET DEFAULT now();\n\n`;
    }

    for (const table of tablesWithCreatedAtOnly) {
        sql += `-- ${table}\n`;
        sql += `ALTER TABLE "${table}" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();\n`;
        sql += `ALTER TABLE "${table}" ALTER COLUMN "createdAt" SET DEFAULT now();\n\n`;
    }

    // SystemSetting doesn't need uuid (key is the PK)
    sql += `-- SystemSetting (key is PK, no uuid needed)\n`;
    sql += `-- No changes needed for SystemSetting\n`;

    console.log(sql);

    // Write to file for easy copy-paste
    const fs = await import('fs');
    fs.writeFileSync('scripts/fix-defaults.sql', sql);
    console.log('\n✅ SQL saved to scripts/fix-defaults.sql');
    console.log('📋 Copy and run this SQL in Supabase Dashboard > SQL Editor');
}

fixDefaults();
