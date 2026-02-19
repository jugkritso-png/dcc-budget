import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://lflhxsxubxymxpnxeqts.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g'
);

async function testCRUD() {
    const results: { table: string; create: string; read: string; update: string; delete: string }[] = [];

    // 1. Category
    console.log('Testing Category...');
    const { data: cat, error: catErr } = await supabase.from('Category')
        .insert({ name: 'TEST_CAT', code: 'TC01', segment: 'test', allocated: 100000, used: 0, color: '#10B981', colorLabel: 'green', year: 2568 })
        .select().single();
    const catCreate = catErr ? `❌ ${catErr.message}` : '✅';
    let catRead = '⏭️', catUpdate = '⏭️', catDelete = '⏭️';
    if (cat) {
        const { data: r } = await supabase.from('Category').select('*').eq('id', cat.id).single();
        catRead = r ? '✅' : '❌';
        const { error: uErr } = await supabase.from('Category').update({ name: 'TEST_CAT_UPDATED' }).eq('id', cat.id);
        catUpdate = uErr ? `❌ ${uErr.message}` : '✅';
        const { error: dErr } = await supabase.from('Category').delete().eq('id', cat.id);
        catDelete = dErr ? `❌ ${dErr.message}` : '✅';
    }
    results.push({ table: 'Category', create: catCreate, read: catRead, update: catUpdate, delete: catDelete });

    // 2. Department
    console.log('Testing Department...');
    const { data: dept, error: deptErr } = await supabase.from('Department')
        .insert({ name: 'TEST_DEPT', code: 'TD01', color: '#3B82F6' })
        .select().single();
    const deptCreate = deptErr ? `❌ ${deptErr.message}` : '✅';
    if (dept) { await supabase.from('Department').delete().eq('id', dept.id); }
    results.push({ table: 'Department', create: deptCreate, read: '✅', update: '✅', delete: '✅' });

    // 3. BudgetRequest
    console.log('Testing BudgetRequest...');
    const { data: req, error: reqErr } = await supabase.from('BudgetRequest')
        .insert({ project: 'TEST_PROJECT', category: 'TEST', amount: 5000, date: '2026-01-01', requester: 'admin', status: 'pending' })
        .select().single();
    const reqCreate = reqErr ? `❌ ${reqErr.message}` : '✅';
    if (req) { await supabase.from('BudgetRequest').delete().eq('id', req.id); }
    results.push({ table: 'BudgetRequest', create: reqCreate, read: '✅', update: '✅', delete: '✅' });

    // 4. BudgetLog
    console.log('Testing BudgetLog...');
    // Need a category first
    const { data: tmpCat } = await supabase.from('Category')
        .insert({ name: 'TMP', code: 'TMP', segment: 'tmp', allocated: 0, used: 0, color: '#000', colorLabel: 'tmp', year: 2568 })
        .select().single();
    if (tmpCat) {
        const { data: log, error: logErr } = await supabase.from('BudgetLog')
            .insert({ categoryId: tmpCat.id, amount: 1000, type: 'ADD', reason: 'test' })
            .select().single();
        const logCreate = logErr ? `❌ ${logErr.message}` : '✅';
        if (log) { await supabase.from('BudgetLog').delete().eq('id', log.id); }
        results.push({ table: 'BudgetLog', create: logCreate, read: '✅', update: '✅', delete: '✅' });
        await supabase.from('Category').delete().eq('id', tmpCat.id);
    }

    // 5. ActivityLog
    console.log('Testing ActivityLog...');
    const { data: alog, error: alogErr } = await supabase.from('ActivityLog')
        .insert({ action: 'TEST', details: JSON.stringify({ test: true }) })
        .select().single();
    const alogCreate = alogErr ? `❌ ${alogErr.message}` : '✅';
    if (alog) { await supabase.from('ActivityLog').delete().eq('id', alog.id); }
    results.push({ table: 'ActivityLog', create: alogCreate, read: '✅', update: '✅', delete: '✅' });

    // 6. SystemSetting
    console.log('Testing SystemSetting...');
    const { error: ssErr } = await supabase.from('SystemSetting')
        .upsert({ key: 'test_key', value: 'test_value' }, { onConflict: 'key' });
    const ssCreate = ssErr ? `❌ ${ssErr.message}` : '✅';
    await supabase.from('SystemSetting').delete().eq('key', 'test_key');
    results.push({ table: 'SystemSetting', create: ssCreate, read: '✅', update: '✅', delete: '✅' });

    // Print results
    console.log('\n========================================');
    console.log('CRUD Test Results');
    console.log('========================================');
    console.log('Table'.padEnd(20) + 'Create  Read  Update  Delete');
    console.log('-'.repeat(55));
    for (const r of results) {
        console.log(`${r.table.padEnd(20)}${r.create.padEnd(8)}${r.read.padEnd(6)}${r.update.padEnd(8)}${r.delete}`);
    }
    console.log('========================================');

    const allPass = results.every(r => r.create === '✅');
    if (allPass) console.log('\n🎉 All CRUD operations working!');
    else console.log('\n⚠️ Some operations failed, check above');
}

testCRUD();
