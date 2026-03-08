import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // SSR guard - return a proxy that doesn't throw on property access
  if (typeof window === "undefined") {
    const handler: ProxyHandler<any> = {
      get: (target: any, prop: string): any => {
        if (prop === "auth") return new Proxy({}, handler);
        if (prop === "from") return () => new Proxy({}, handler);
        if (prop === "channel") return () => new Proxy({}, handler);
        if (prop === "on") return () => new Proxy({}, handler);
        if (prop === "subscribe") return () => ({});
        if (typeof target[prop] === "function")
          return () => new Proxy({}, handler);
        return new Proxy({}, handler);
      },
      apply: () => new Proxy({}, handler),
    };
    return new Proxy({}, handler);
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
