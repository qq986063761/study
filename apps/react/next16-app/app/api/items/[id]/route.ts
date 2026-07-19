import { NextResponse } from "next/server";
import { deleteItem, getItem, updateItem } from "@/lib/items-store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = await getItem(id);
  if (!item) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PUT(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
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
  const item = await updateItem(id, {
    title,
    body: text,
    attachmentUrl:
      attachmentUrl === undefined
        ? undefined
        : attachmentUrl === null
          ? null
          : typeof attachmentUrl === "string"
            ? attachmentUrl
            : null,
  });
  if (!item) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ok = await deleteItem(id);
  if (!ok) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
