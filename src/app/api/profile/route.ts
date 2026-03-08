import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// We explicitly type the edge runtime or nodejs if needed, but default is fine.
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");
  const email = searchParams.get("email");

  if (!userId && !email) {
    return NextResponse.json(
      { error: "Missing id or email parameter" },
      { status: 400 },
    );
  }

  // Bypass RLS with SERVICE_ROLE_KEY to get the true user profile and role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  try {
    let query = supabaseAdmin.from("User").select("*");

    if (userId) {
      query = query.eq("id", userId);
    } else if (email) {
      query = query.eq("email", email);
    }

    const { data: profile, error } = await query.maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
