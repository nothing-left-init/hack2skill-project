import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateProductStory, generateArtisanStory } from "./services/gemini";
import { insertArtisanSchema, insertProductSchema, insertStorySchema, insertCartItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Artisan routes
  app.get("/api/artisans", async (req, res) => {
    try {
      const artisans = await storage.getArtisans();
      res.json(artisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisans" });
    }
  });

  app.get("/api/artisans/featured", async (req, res) => {
    try {
      const artisans = await storage.getFeaturedArtisans();
      res.json(artisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured artisans" });
    }
  });

  app.get("/api/artisans/:id", async (req, res) => {
    try {
      const artisan = await storage.getArtisan(req.params.id);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }
      res.json(artisan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisan" });
    }
  });

  app.post("/api/artisans", async (req, res) => {
    try {
      const validatedData = insertArtisanSchema.parse(req.body);
      const artisan = await storage.createArtisan(validatedData);
      res.status(201).json(artisan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid artisan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create artisan" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/artisans/:id/products", async (req, res) => {
    try {
      const products = await storage.getProductsByArtisan(req.params.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisan products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Story routes
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStory(req.params.id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid story data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(req.params.id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // AI Story Generation routes
  const aiStorySchema = z.object({
    productName: z.string().min(1),
    craftType: z.string().min(1),
    heritage: z.string().optional(),
    artisanId: z.string().min(1),
  });

  app.post("/api/ai/generate-story", async (req, res) => {
    try {
      const validatedData = aiStorySchema.parse(req.body);
      
      // Get artisan details
      const artisan = await storage.getArtisan(validatedData.artisanId);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      const storyResponse = await generateProductStory({
        productName: validatedData.productName,
        craftType: validatedData.craftType,
        heritage: validatedData.heritage,
        artisanName: artisan.name,
        artisanLocation: artisan.location,
      });

      // Save the generation
      await storage.createAiGeneration({
        artisanId: validatedData.artisanId,
        productName: validatedData.productName,
        craftType: validatedData.craftType,
        heritage: validatedData.heritage || "",
        generatedDescription: storyResponse.description,
        generatedCaptions: storyResponse.captions,
      });

      res.json(storyResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("AI generation error:", error);
      res.status(500).json({ message: "Failed to generate story" });
    }
  });

  app.get("/api/ai/generations/:artisanId", async (req, res) => {
    try {
      const generations = await storage.getArtisanGenerations(req.params.artisanId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI generations" });
    }
  });

  // ------------------------ Demo mode endpoints ------------------------
  // These endpoints power the local demo: CRUD, file "upload", and a mock chatbot.
  // Data is persisted to `server/demo-data.json` and files are written to `server/uploads`.
  import('./demoStorage').then(({ demoStorage }) => {
    app.get('/api/demo/items', async (_req, res) => {
      try {
        res.json(demoStorage.listItems());
      } catch (e) {
        res.status(500).json({ message: 'Failed to list demo items' });
      }
    });

    app.post('/api/demo/items', async (req, res) => {
      try {
        const { title, description, price } = req.body;
        if (!title || typeof title !== 'string') return res.status(400).json({ message: 'Invalid title' });
        const item = demoStorage.createItem({ title, description, price });
        res.status(201).json(item);
      } catch (e) {
        res.status(500).json({ message: 'Failed to create item' });
      }
    });

    app.put('/api/demo/items/:id', async (req, res) => {
      try {
        const updated = demoStorage.updateItem(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Item not found' });
        res.json(updated);
      } catch (e) {
        res.status(500).json({ message: 'Failed to update item' });
      }
    });

    app.delete('/api/demo/items/:id', async (req, res) => {
      try {
        const ok = demoStorage.deleteItem(req.params.id);
        if (!ok) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Deleted' });
      } catch (e) {
        res.status(500).json({ message: 'Failed to delete item' });
      }
    });

    // Simulated file upload: expects { filename, contentBase64 }
    app.post('/api/demo/upload', async (req, res) => {
      try {
        const { filename, contentBase64 } = req.body;
        if (!filename || !contentBase64) return res.status(400).json({ message: 'Missing file payload' });
        const fileRec = demoStorage.saveFile(filename, contentBase64);
        res.status(201).json(fileRec);
      } catch (e) {
        res.status(500).json({ message: 'Failed to save file' });
      }
    });

    app.get('/api/demo/files', async (_req, res) => {
      try {
        res.json(demoStorage.listFiles());
      } catch (e) {
        res.status(500).json({ message: 'Failed to list files' });
      }
    });

    // Simple rule-based mock chatbot
    app.post('/api/demo/chat', async (req, res) => {
      try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') return res.status(400).json({ message: 'Invalid message' });

        const m = message.toLowerCase();
        let reply = "Sorry, I don't understand — this is Demo Mode.";

        if (m.includes('hello') || m.includes('hi')) reply = 'Hello! This is Demo Mode chatbot. How can I help you today?';
        else if (m.includes('create') || m.includes('save')) reply = 'To create an item, use the form — try adding a title and price.';
        else if (m.includes('upload')) reply = 'Use the Upload UI to pick a file; the demo will simulate storing it locally.';
        else if (m.includes('demo')) reply = 'This site is running in Demo Mode — no external APIs are called.';
        else reply = "That's interesting — in a real app an AI would craft a helpful response. (Mock reply)";

        // small fake latency to feel realistic
        await new Promise(r => setTimeout(r, 500));
        res.json({ reply, timestamp: new Date().toISOString() });
      } catch (e) {
        res.status(500).json({ message: 'Chatbot error' });
      }
    });
  }).catch(err => console.error('Failed to load demoStorage', err));

  const httpServer = createServer(app);
  return httpServer;
}
