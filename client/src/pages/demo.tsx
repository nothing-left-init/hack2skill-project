import React, { useEffect, useState } from 'react';
import { listItems, createItem, updateItem, deleteItem, uploadFile, listFiles, chat } from '@/lib/demoApi';

export default function DemoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('Hello');

  useEffect(() => { fetchList(); fetchFiles(); }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await listItems();
      setItems(res || []);
    } catch (e) {
      console.error(e);
      alert('Failed to load items (Demo Mode)');
    } finally { setLoading(false); }
  }

  async function fetchFiles() {
    try { const f = await listFiles(); setFiles(f || []); } catch (e) { console.error(e); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const it = await createItem({ title, description: desc, price });
      setTitle(''); setDesc(''); setPrice('');
      setItems(prev => [it, ...prev]);
    } catch (e) { console.error(e); alert('Create failed'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this demo item?')) return;
    try { await deleteItem(id); setItems(prev => prev.filter(i => i.id !== id)); } catch (e) { console.error(e); alert('Delete failed'); }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const data = (reader.result as string).split(',')[1];
      try {
        const rec = await uploadFile(file.name, data);
        setFiles(prev => [rec, ...prev]);
        alert('Upload simulated successfully (Demo Mode)');
      } catch (e) { console.error(e); alert('Upload failed'); }
    };
    reader.readAsDataURL(file);
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
    try {
      const res = await chat(chatInput);
      setChatMessages(prev => [...prev, { from: 'bot', text: res.reply }]);
      setChatInput('');
    } catch (e) { console.error(e); alert('Chat failed'); }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
        <strong>Demo Mode:</strong> This site uses local, simulated data only. No external APIs are used.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Create Demo Item</h2>
          <form onSubmit={handleCreate} className="space-y-2">
            <input className="w-full border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="w-full border p-2" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
            <textarea className="w-full border p-2" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
              <button type="button" onClick={() => { setTitle(''); setDesc(''); setPrice(''); }} className="px-4 py-2 border rounded">Reset</button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Upload File (Simulated)</h2>
          <input type="file" onChange={e => handleUpload(e.target.files ? e.target.files[0] : null)} />
          <div className="mt-4">
            <h3 className="font-medium">Uploaded files</h3>
            <ul className="mt-2 space-y-2">
              {files.map(f => (
                <li key={f.id} className="flex items-center justify-between border p-2 rounded">
                  <div>
                    <div className="font-medium">{f.filename}</div>
                    <div className="text-sm text-muted-foreground">{Math.round(f.size/1024)} KB • {new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">Dashboard — Demo Items</h2>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {items.map(it => (
              <li key={it.id} className="border p-3 rounded flex justify-between items-start">
                <div>
                  <div className="font-medium">{it.title} <span className="text-sm text-muted-foreground">${it.price}</span></div>
                  <div className="text-sm">{it.description}</div>
                  <div className="text-xs text-muted-foreground">{new Date(it.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { const newTitle = prompt('New title', it.title); if (newTitle) updateItem(it.id, { title: newTitle }).then(fetchList); }} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(it.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">AI Chatbot (Mock)</h2>
        <div className="border rounded p-3 h-56 overflow-auto bg-gray-50">
          {chatMessages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.from === 'bot' ? 'text-left' : 'text-right'}`}>
              <div className={`inline-block px-3 py-2 rounded ${m.from === 'bot' ? 'bg-white' : 'bg-blue-600 text-white'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 border p-2" placeholder="Say something to the demo bot" />
          <button onClick={sendChat} className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
        </div>
      </section>
    </div>
  );
}
