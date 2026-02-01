# ArtisanAlley — Full-Stack Demo

A production-ready demo website showcasing artisans, handmade products, and AI-powered storytelling. **This is Demo Mode — all data is local and simulated. No external APIs or paid services are used.**

## 🎯 Demo Mode Features

### ✨ What You Get
- **Responsive UI** with modern design (Tailwind CSS + Radix UI components)
- **CRUD Operations** — Create, read, update, delete demo items (form-based workflow)
- **Simulated File Upload** — "Upload" files and store them locally in `server/uploads/`
- **Mock AI Chatbot** — Rule-based responses simulating an AI assistant
- **Local Data Persistence** — JSON file at `server/demo-data.json`
- **Production-like UX** — Success/error states, loading indicators, proper feedback

### 🚀 Quick Start

#### Prerequisites
- **Node.js** >= 18
- **npm** or **yarn**

#### Installation & Setup

```bash
# Clone / open this repo
cd ArtisanAlley-main

# Install dependencies
npm install

# Optional: Install a specific missing package if needed
npm install cross-env

# Start development servers (in separate terminals or background)

# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
npx vite

# Or run both in the background:
npm run dev &
npx vite &
```

#### Access the App

- **Frontend:** http://localhost:5173/
- **Backend API:** http://127.0.0.1:5000
- **Demo Page:** http://localhost:5173/demo

---

## 📋 Demo Mode Workflows

### 1. **Create & Manage Items** (CRUD)

**Endpoint:** `POST /api/demo/items`

1. Navigate to `/demo`
2. Fill in the form:
   - **Title** (required)
   - **Price** (optional)
   - **Description** (optional)
3. Click **"Create"**
4. New item appears in the dashboard
5. **Edit** or **Delete** items from the list

**Data stored:** `server/demo-data.json` (JSON array of items)

### 2. **File Upload (Simulated)**

**Endpoint:** `POST /api/demo/upload`

1. On the Demo page, click **"Upload File"**
2. Select any file from your computer
3. File is encoded to base64 and sent to backend
4. Backend saves to `server/uploads/<id>-<filename>`
5. File appears in the **"Uploaded Files"** list

**Data stored:**
- Files: `server/uploads/` (physical files)
- Metadata: `server/demo-data.json` (JSON records)

### 3. **AI Chatbot (Mock)**

**Endpoint:** `POST /api/demo/chat`

1. Scroll to **"AI Chatbot"** section
2. Enter a message (try: "hello", "create", "upload", "demo")
3. Mock bot responds based on keyword matching
4. ~500ms simulated latency for realism

**Logic:** Simple rule-based replies (no external API)

---

## 📁 Project Structure

```
ArtisanAlley-main/
├── client/
│   ├── src/
│   │   ├── App.tsx                    # Main router
│   │   ├── pages/
│   │   │   └── demo.tsx               # Demo page (CRUD + file upload + chat UI)
│   │   ├── lib/
│   │   │   ├── demoApi.ts             # Demo API calls
│   │   │   ├── api.ts                 # Main API calls
│   │   │   └── queryClient.ts         # React Query + fetch wrapper
│   │   └── ...
│   ├── index.html
│   └── vite.config.ts
│
├── server/
│   ├── index.ts                       # Express server entry
│   ├── routes.ts                      # All routes (demo + production)
│   ├── demoStorage.ts                 # Demo data management (JSON + in-memory)
│   ├── storage.ts                     # Production storage (in-memory for demo)
│   └── ...
│
├── shared/
│   └── schema.ts                      # TypeScript types & Zod schemas
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md (this file)
```

---

## 🔧 Backend API Reference

### Demo Endpoints

All demo endpoints are prefixed with `/api/demo`.

#### **Items (CRUD)**

```bash
# List all items
GET /api/demo/items
# Response: [ { id, title, description, price, createdAt }, ... ]

# Create item
POST /api/demo/items
# Body: { title: string, description?: string, price?: string }
# Response: { id, title, description, price, createdAt }

# Update item
PUT /api/demo/items/:id
# Body: { title?, description?, price? }
# Response: { id, title, description, price, createdAt }

# Delete item
DELETE /api/demo/items/:id
# Response: { message: "Deleted" }
```

#### **File Upload**

```bash
# Upload file (base64 encoded)
POST /api/demo/upload
# Body: { filename: string, contentBase64: string }
# Response: { id, filename, path, size, createdAt }

# List uploaded files
GET /api/demo/files
# Response: [ { id, filename, path, size, createdAt }, ... ]
```

#### **Chatbot**

```bash
# Send message to mock chatbot
POST /api/demo/chat
# Body: { message: string }
# Response: { reply: string, timestamp: string }
```

---

## 💾 Data Storage

### Local Files

- **`server/demo-data.json`** — Persisted items and file metadata
- **`server/uploads/`** — Uploaded files (base64 → binary)

### In-Memory

- Loaded at server start from `demo-data.json`
- Changes are written back to disk on create/update/delete

### Reset Demo Data

To start fresh:

```bash
# Stop the server
# Delete the demo data file
rm server/demo-data.json

# Restart the server
npm run dev
```

---

## 🎨 Frontend Components & Pages

### Demo Page (`client/src/pages/demo.tsx`)

A single-page dashboard showcasing:
- **Form Section** — Create items with CRUD operations
- **File Upload Section** — Upload and list files
- **Dashboard** — View, edit, delete items
- **Chatbot Section** — Interactive mock AI chat

### Navigation

Add a link in the navbar to reach the demo:

```tsx
<Link href="/demo">Demo Mode</Link>
```

---

## 🚢 Production Considerations

**This is a demo.** To deploy as a real app:

1. **Replace demo storage** with a real database (PostgreSQL, MongoDB, etc.)
2. **Implement real AI** using OpenAI, Google Gemini, or other APIs
3. **Add authentication** (Passport, Auth0, etc.)
4. **Use cloud storage** for file uploads (AWS S3, Cloudinary, etc.)
5. **Set up proper error handling & logging**
6. **Add rate limiting & security headers**
7. **Deploy backend** to Node.js hosting (Vercel, Railway, Render, etc.)
8. **Deploy frontend** to static host (Vercel, Netlify, etc.)

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start backend (dev mode with tsx)
npm run dev

# Type check (TypeScript)
npm run check

# Start frontend (Vite)
cd client && npm run dev
# or from root:
npx vite

# Build for production
npm run build

# Start production build
npm run start
```

---

## 📝 Code Quality

- ✅ TypeScript for type safety
- ✅ Clean, well-commented code
- ✅ Responsive design (mobile-first)
- ✅ Production-like error/success states
- ✅ Proper HTTP status codes
- ✅ Zod schema validation (where applicable)

---

## 🎓 Learning Outcomes

This demo teaches:
- Full-stack React + Node/Express architecture
- Form handling & CRUD operations
- File uploads & local persistence
- Mock API & chatbot logic
- Component design with Radix UI + Tailwind
- TypeScript best practices
- Hot-reload development setup (Vite + tsx)

---

## 📄 License

MIT

---

## 🤝 Contributing

This is a demo repo. For educational purposes only. Feel free to fork and modify!

---

**Happy demoing! 🎉**
