import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
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
    // Simple role‑based permission map
    let userRole = 'user'
    if (user) {
        // First try to check metadata
        if (user.user_metadata?.role) {
            userRole = String(user.user_metadata.role).toLowerCase()
        } else {
            // Fetch from database as fallback bypassing RLS to get true role
            const supabaseAdmin = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get: () => undefined,
                        set: () => { },
                        remove: () => { },
                    }
                }
            )

            const { data: profile } = await supabaseAdmin.from('User').select('role').eq('id', user.id).maybeSingle()

            if (!profile?.role && user.email) {
                // Email fallback
                const { data: profileByEmail } = await supabaseAdmin.from('User').select('role').eq('email', user.email).maybeSingle()
                if (profileByEmail?.role) {
                    userRole = String(profileByEmail.role).toLowerCase()
                }
            } else if (profile?.role) {
                userRole = String(profile.role).toLowerCase()
            }
        }

        // Allow all pages for admin, manager, finance, approver
        // Restrict 'user' or 'staff' to dashboard and request
        const rolePermissions: Record<string, string[]> = {
            admin: ['*'],
            manager: ['*'],
            finance: ['*'],
            approver: ['*'],
            staff: ['/dashboard', '/request', '/report', '/settings'],
            user: ['/dashboard', '/request', '/report', '/settings'],
        }

        const allowedRoutes = rolePermissions[userRole] ?? ['/dashboard']
        const path = request.nextUrl.pathname

        // isAuthPage already handled above
        if (!isAuthPage) {
            const isAllowed = allowedRoutes.includes('*') || allowedRoutes.some((r) => path.startsWith(r))

            if (!isAllowed) {
                const url = new URL('/dashboard', request.url)
                url.searchParams.set('unauthorized', '1')
                return NextResponse.redirect(url)
            }
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
