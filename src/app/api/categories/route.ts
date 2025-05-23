export const dynamic = "force-dynamic";
import supabase from "@/supabase/client";

export async function GET() {
  const {data: categories, error} = await supabase.from("categories").select("*");;

  if(error) {
    return new Response(JSON.stringify({message: error.message}), {
      status: 500
    })
  }

  return new Response(JSON.stringify({ categories }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
