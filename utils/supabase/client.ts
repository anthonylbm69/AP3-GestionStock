import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        "https://kmdpmjamxoigctqdogtz.supabase.com",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZHBtamFteG9pZ2N0cWRvZ3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYzODIsImV4cCI6MjA1NDg1MjM4Mn0.rl_lYU3bP-MjuqXFfk-YwFVDNxfJnrwUEp2Tfs727dY",
    )
}