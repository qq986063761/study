import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Item } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "items.json");

async function ensureDataFile(): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile);
  } catch {
    await writeFile(dataFile, "[]\n", "utf-8");
  }
}

export async function listItems(): Promise<Item[]> {
  await ensureDataFile();
  const raw = await readFile(dataFile, "utf-8");
  return JSON.parse(raw) as Item[];
}

async function persist(items: Item[]): Promise<void> {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

export async function getItem(id: string): Promise<Item | undefined> {
  const items = await listItems();
  return items.find((i) => i.id === id);
}

export async function createItem(input: {
  title: string;
  body: string;
  attachmentUrl?: string | null;
}): Promise<Item> {
  const items = await listItems();
  const now = new Date().toISOString();
  const item: Item = {
    id: randomUUID(),
    title: input.title.trim(),
    body: input.body.trim(),
    attachmentUrl: input.attachmentUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(item);
  await persist(items);
  return item;
}

export async function updateItem(
  id: string,
  input: {
    title: string;
    body: string;
    attachmentUrl?: string | null;
  },
): Promise<Item | null> {
  const items = await listItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const prev = items[idx];
  const next: Item = {
    ...prev,
    title: input.title.trim(),
    body: input.body.trim(),
    attachmentUrl:
      input.attachmentUrl === undefined ? prev.attachmentUrl : input.attachmentUrl,
    updatedAt: now,
  };
  items[idx] = next;
  await persist(items);
  return next;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await listItems();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await persist(next);
  return true;
}
