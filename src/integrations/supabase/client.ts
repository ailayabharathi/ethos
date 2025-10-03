import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azvddsrwyspygexxkytk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmRkc3J3eXNweWdleHhreXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Mzc3OTIsImV4cCI6MjA3NDAxMzc5Mn0.48puJge5ezcvM1tpsQbaYr9gkvKoBVNVbkXlC4YZVoA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);