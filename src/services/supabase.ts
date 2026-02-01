import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dnrhnoppnwtdaosstyca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRucmhub3Bwbnd0ZGFvc3N0eWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjYxMTUsImV4cCI6MjA4NTIwMjExNX0.QYagwHvRniOhHTvcV12UHarfZpq69ihdSLWYgttqO1Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
