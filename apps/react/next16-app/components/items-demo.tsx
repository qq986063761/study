"use client";

import { useCallback, useEffect, useState } from "react";
import type { Item } from "@/lib/types";

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url.split("?")[0] ?? "");
}

export function ItemsDemo() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const refresh = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/items", { cache: "no-store" });
    if (!res.ok) {
      setError("加载列表失败");
      return;
    }
    const data = (await res.json()) as { items: Item[] };
    setItems(data.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  function resetForm() {
    setTitle("");
    setBody("");
    setAttachmentUrl(null);
    setEditingId(null);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "上传失败");
        return;
      }
      if (data.url) setAttachmentUrl(data.url);
    } catch {
      setError("上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      title,
      body,
      attachmentUrl,
    };
    try {
      if (editingId) {
        const res = await fetch(`/api/items/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "更新失败");
          return;
        }
      } else {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "创建失败");
          return;
        }
      }
      resetForm();
      await refresh();
    } catch {
      setError("请求失败");
    }
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setTitle(item.title);
    setBody(item.body);
    setAttachmentUrl(item.attachmentUrl);
  }

  async function remove(id: string) {
    if (!confirm("确定删除这条记录？")) return;
    setError(null);
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "删除失败");
        return;
      }
      if (editingId === id) resetForm();
      await refresh();
    } catch {
      setError("删除失败");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {editingId ? "编辑条目" : "新建条目"}
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              标题
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="标题"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              内容
            </label>
            <textarea
              className="min-h-[100px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="正文"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              附件（可选）
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                <input
                  type="file"
                  className="sr-only"
                  onChange={onUpload}
                  disabled={uploading}
                />
                {uploading ? "上传中…" : "选择文件"}
              </label>
              {attachmentUrl && (
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline dark:text-red-400"
                  onClick={() => setAttachmentUrl(null)}
                >
                  清除附件
                </button>
              )}
            </div>
            {attachmentUrl && (
              <p className="mt-2 break-all text-xs text-zinc-500 dark:text-zinc-400">
                已选：{attachmentUrl}
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {editingId ? "保存" : "创建"}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
                onClick={resetForm}
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          列表 {loading ? "（加载中）" : `（${items.length} 条）`}
        </h2>
        {!loading && items.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">暂无数据，请先创建。</p>
        )}
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                    onClick={() => startEdit(item)}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                    onClick={() => remove(item.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
              {item.body ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                  {item.body}
                </p>
              ) : null}
              {item.attachmentUrl ? (
                <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    附件
                  </p>
                  {isImageUrl(item.attachmentUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.attachmentUrl}
                      alt=""
                      className="max-h-64 max-w-full rounded-lg border border-zinc-200 object-contain dark:border-zinc-700"
                    />
                  ) : (
                    <a
                      href={item.attachmentUrl}
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.attachmentUrl}
                    </a>
                  )}
                </div>
              ) : null}
              <p className="mt-3 text-xs text-zinc-400">
                更新：{new Date(item.updatedAt).toLocaleString("zh-CN")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
