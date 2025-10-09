import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnaygpnnkdqivizlwnlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduYXlncG5ua2RxaXZpemx3bmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMTcyNzQsImV4cCI6MjA3NTU5MzI3NH0.3WZ59GwL0dgHwbBNiR8M0hjocnxopMIwIJqMBqxM5mM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);