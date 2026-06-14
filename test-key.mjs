import { createClient } from '@supabase/supabase-js';

const URL = 'https://twcdwrcheytlhipvbrti.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y2R3cmNoZXl0bGhpcHZicnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTE2MzMsImV4cCI6MjA5Njk4NzYzM30.iEkLD3yYX-D8YWcHKZiqO1meOqdrQekdqryxHTx1Ea4';

const sb = createClient(URL, ANON);

console.log('--- 1. services o\'qish ---');
const r1 = await sb.from('services').select('id,title').limit(2);
console.log('error:', r1.error);
console.log('nechta:', r1.data ? r1.data.length : 0);

console.log('\n--- 2. admin login ---');
const r2 = await sb.auth.signInWithPassword({ email: 'admin@climate-life.uz', password: 'admin2026' });
console.log('error:', r2.error ? r2.error.message : null);
console.log('session bor:', !!r2.data?.session);
