import { buildProjectPromptText } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const text = await buildProjectPromptText();
  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}


