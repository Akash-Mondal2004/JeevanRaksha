import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl ='https://apafrjmakipomralwxhg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYWZyam1ha2lwb21yYWx3eGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NzMyNTUsImV4cCI6MjA2NjA0OTI1NX0.L6EwyFS0CXqx8m_0Oa0BuOB3stLVgr2dA4rrtgYsIBY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);