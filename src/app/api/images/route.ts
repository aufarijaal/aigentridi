import supabase from "@/supabase/client";
import { type NextRequest } from "next/server";

export async function GET(
  r: NextRequest,
) {
  const searchParams = r.nextUrl.searchParams
  const q = searchParams.get('q')
  const category = searchParams.get('category')

  let query = supabase.from("assets").select("*").ilike("title", `%${q ?? ""}%`).order("title");

  if(category != "0") {
    query.eq("category_id", category);
  }

  const {data: images, error} = await query;

  if(error) {
    return new Response(JSON.stringify({message: error.message}), {
      status: 500
    })
  }

  return new Response(JSON.stringify({ images }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
