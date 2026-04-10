import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * API Route: GET /api/passwords
 * Fetches all passwords for the authenticated user
 * Requires: Valid session with httpOnly cookie
 */
export async function GET(request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
        },
      },
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch passwords for authenticated user
    const { data: passwords, error } = await supabase
      .from("passwords")
      .select("id, title, account_name, created_at, updated_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: passwords });
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return NextResponse.json(
      { error: "Failed to fetch passwords" },
      { status: 500 },
    );
  }
}
