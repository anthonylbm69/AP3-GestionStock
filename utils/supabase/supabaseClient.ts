import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lhbwvjpgiybzgolbxzhr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYnd2anBnaXliemdvbGJ4emhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTM3NzksImV4cCI6MjA0OTU2OTc3OX0.QxOi3mMIJcNAG9GTZAR9XIC0m7ms6ZlImP6C0WqUWPM";
export const supabase = createClient(supabaseUrl, supabaseKey);
