import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.STRAPI_WEBHOOK_SECRET;
  const supplied = request.headers.get("x-webhook-secret") ?? "";
  if (!secret || secret.length < 32) return Response.json({ error: "Not configured" }, { status: 503 });
  if (Buffer.byteLength(secret) !== Buffer.byteLength(supplied) || !timingSafeEqual(Buffer.from(secret), Buffer.from(supplied))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (Number(request.headers.get("content-length")) > 65536) return Response.json({ error: "Too large" }, { status: 413 });
  try {
    const raw = await request.text();
    if (raw.length > 65536) return Response.json({ error: "Too large" }, { status: 413 });
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== "object") throw new Error();
    const { event, model } = payload as Record<string, unknown>;
    if (!["entry.create", "entry.update", "entry.publish", "entry.unpublish", "entry.delete"].includes(String(event)) || !["project", "technology", "global", "about", "service", "experience"].includes(String(model))) return Response.json({ ignored: true });
    revalidateTag("portfolio", { expire: 0 });
    revalidateTag("projects", { expire: 0 });
    for (const locale of ["en", "ar"]) { revalidatePath(`/${locale}`); revalidatePath(`/${locale}/projects`); }
    revalidatePath("/[locale]/projects/[slug]", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath("/[locale]", "layout");
    return Response.json({ revalidated: true });
  } catch { return Response.json({ error: "Invalid payload" }, { status: 400 }); }
}
