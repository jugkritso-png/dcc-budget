
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // SSR guard
    if (typeof window === 'undefined') {
        // Return a mock or handle server-side if needed, but for build we just need it to not throw/crash
        return {} as any;
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
