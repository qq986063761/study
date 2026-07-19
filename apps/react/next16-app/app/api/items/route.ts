import { NextResponse } from "next/server";
import { createItem, listItems } from "@/lib/items-store";

export async function GET() {
  const items = await listItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效的 JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }
  const { title, body: text, attachmentUrl } = body as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "标题必填" }, { status: 400 });
  }
  if (typeof text !== "string") {
    return NextResponse.json({ error: "内容须为字符串" }, { status: 400 });
  }
  const att =
    attachmentUrl === null || attachmentUrl === undefined
      ? null
      : typeof attachmentUrl === "string"
        ? attachmentUrl
        : null;
  const item = await createItem({
    title,
    body: text,
    attachmentUrl: att,
  });
  return NextResponse.json({ item }, { status: 201 });
}
