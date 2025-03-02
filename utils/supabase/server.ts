'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient("https://kmdpmjamxoigctqdogtz.supabase.com",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZHBtamFteG9pZ2N0cWRvZ3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYzODIsImV4cCI6MjA1NDg1MjM4Mn0.rl_lYU3bP-MjuqXFfk-YwFVDNxfJnrwUEp2Tfs727dY",

        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}