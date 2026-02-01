import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = path.resolve(process.cwd(), 'server', 'demo-data.json');
const UPLOAD_DIR = path.resolve(process.cwd(), 'server', 'uploads');

interface DemoItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
  createdAt: string;
}

interface DemoFile {
  id: string;
  filename: string;
  path: string;
  size: number;
  createdAt: string;
}

function ensureDirs() {
  if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function readData() {
  ensureDirs();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { items: [], files: [] };
  }
}

function writeData(data: any) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const demoStorage = {
  listItems(): DemoItem[] {
    const d = readData();
    return d.items as DemoItem[];
  },

  createItem(payload: { title: string; description?: string; price?: string }): DemoItem {
    const d = readData();
    const item: DemoItem = {
      id: randomUUID(),
      title: payload.title,
      description: payload.description || '',
      price: payload.price || '0.00',
      createdAt: new Date().toISOString(),
    };
    d.items.unshift(item);
    writeData(d);
    return item;
  },

  updateItem(id: string, updates: Partial<DemoItem>): DemoItem | null {
    const d = readData();
    const idx = (d.items || []).findIndex((i: any) => i.id === id);
    if (idx === -1) return null;
    d.items[idx] = { ...d.items[idx], ...updates };
    writeData(d);
    return d.items[idx];
  },

  deleteItem(id: string): boolean {
    const d = readData();
    const before = (d.items || []).length;
    d.items = (d.items || []).filter((i: any) => i.id !== id);
    writeData(d);
    return (d.items || []).length < before;
  },

  saveFile(filename: string, base64: string): DemoFile {
    ensureDirs();
    const buffer = Buffer.from(base64, 'base64');
    const id = randomUUID();
    const safe = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filepath = path.join(UPLOAD_DIR, `${id}-${safe}`);
    fs.writeFileSync(filepath, buffer);
    const d = readData();
    const fileRec: DemoFile = {
      id,
      filename: safe,
      path: filepath,
      size: buffer.length,
      createdAt: new Date().toISOString(),
    };
    d.files = d.files || [];
    d.files.unshift(fileRec);
    writeData(d);
    return fileRec;
  },

  listFiles(): DemoFile[] {
    const d = readData();
    return d.files || [];
  },
};
