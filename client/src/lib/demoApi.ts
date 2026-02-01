const base = '/api/demo';

export async function listItems() {
  const res = await fetch(`${base}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function createItem(payload: { title: string; description?: string; price?: string }) {
  const res = await fetch(`${base}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

export async function updateItem(id: string, updates: any) {
  const res = await fetch(`${base}/items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

export async function deleteItem(id: string) {
  const res = await fetch(`${base}/items/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
}

export async function uploadFile(filename: string, base64: string) {
  const res = await fetch(`${base}/upload`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, contentBase64: base64 }) });
  if (!res.ok) throw new Error('Failed to upload file');
  return res.json();
}

export async function listFiles() {
  const res = await fetch(`${base}/files`);
  if (!res.ok) throw new Error('Failed to list files');
  return res.json();
}

export async function chat(message: string) {
  const res = await fetch(`${base}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}
