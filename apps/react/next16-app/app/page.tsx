import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Next.js 16 全栈示例
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          页面渲染、JSON 持久化 CRUD、附件上传与展示
        </h1>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          数据保存在服务端{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            data/items.json
          </code>
          ；上传文件位于{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            public/uploads
          </code>
          ，通过{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            /uploads/…
          </code>{" "}
          访问。
        </p>
        <div>
          <Link
            href="/demo"
            className="inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            进入 Demo
          </Link>
        </div>
      </main>
    </div>
  );
}
