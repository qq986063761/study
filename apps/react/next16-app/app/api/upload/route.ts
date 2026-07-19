import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const maxBytes = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "无法解析表单" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "缺少 file 字段" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "文件为空" }, { status: 400 });
  }
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "文件超过 5MB 限制" }, { status: 413 });
  }
  const ext = path.extname(file.name) || "";
  const safeExt = ext.match(/^\.[a-zA-Z0-9]+$/) ? ext : "";
  const name = `${randomUUID()}${safeExt}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);
  const url = `/uploads/${name}`;
  return NextResponse.json({
    url,
    originalName: file.name,
    size: file.size,
  });
}
