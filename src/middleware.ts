import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ---- Authentication guards ----
    const isAuthPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
    if (!user && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ---- Permission enforcement ----
    // Simple role‑based permission map (replace with DB‑driven settings later)
    const rolePermissions: Record<string, string[]> = {
        admin: ['*'], // all routes
        manager: ['/budget', '/management', '/analytics', '/dashboard'],
        staff: ['/dashboard'],
        user: ['/dashboard'],
    }

    if (user) {
        const userRole = (user?.user_metadata?.role as string) || 'staff'
        const allowedRoutes = rolePermissions[userRole] ?? []
        const path = request.nextUrl.pathname
        const isAllowed = allowedRoutes.includes('*') || allowedRoutes.some((r) => path.startsWith(r))

        if (!isAllowed) {
            const url = new URL('/dashboard', request.url)
            url.searchParams.set('unauthorized', '1')
            return NextResponse.redirect(url)
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
