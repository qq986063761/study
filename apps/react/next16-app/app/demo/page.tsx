import Link from "next/link";
import { ItemsDemo } from "@/components/items-demo";

export default function DemoPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            全栈 Demo：CRUD + 上传
          </h1>
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            返回首页
          </Link>
        </div>
      </div>
      <ItemsDemo />
    </div>
  );
}
