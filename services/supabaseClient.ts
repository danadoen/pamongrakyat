import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase dengan kredensial yang diberikan
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://huuypyttenylbijsgqim.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dXlweXR0ZW55bGJpanNncWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjE5OTMsImV4cCI6MjA3OTI5Nzk5M30.wzU_ImRFjUwzs2uNrEudA7Psd4tdnHDLZ7G4-Blmk0o';

// Membuat client Supabase
// Service layer (newsService.ts) akan otomatis menggunakan ini jika tersedia
export const supabase = createClient(supabaseUrl, supabaseKey);