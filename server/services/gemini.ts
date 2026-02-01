import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Google Gemini instead of OpenAI for AI generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCoZszH2MDMFP65aAILLk-5bhlqhXDZvB4");

export interface StoryGenerationRequest {
  productName: string;
  craftType: string;
  heritage?: string;
  artisanName: string;
  artisanLocation: string;
}

export interface StoryGenerationResponse {
  description: string;
  captions: string[];
}

export async function generateProductStory(request: StoryGenerationRequest): Promise<StoryGenerationResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an expert storyteller specializing in artisan crafts and cultural heritage. Create compelling content for a handmade product.

Product Details:
- Name: ${request.productName}
- Craft Type: ${request.craftType}
- Cultural Heritage: ${request.heritage || 'Not specified'}
- Artisan: ${request.artisanName} from ${request.artisanLocation}

Generate:
1. A detailed product description (2-3 sentences) that captures the craftsmanship, cultural significance, and emotional appeal
2. Three social media captions (different styles: inspirational, storytelling, and product-focused)

Respond with JSON in this exact format:
{
  "description": "Product description here",
  "captions": ["Caption 1", "Caption 2", "Caption 3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from the response
    let parsedResult;
    try {
      // Try to extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // Fallback response
      parsedResult = {
        description: "A beautiful handcrafted piece that showcases traditional artisanship and cultural heritage.",
        captions: ["Handcrafted with love and tradition", "Authentic artisan craftsmanship", "Preserving cultural heritage through craft"]
      };
    }
    
    return {
      description: parsedResult.description || "A beautiful handcrafted piece.",
      captions: parsedResult.captions || ["Handcrafted with love", "Artisan made", "Traditional craft"]
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate product story");
  }
}

export async function generateArtisanStory(artisanName: string, specialty: string, location: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Write a 2-3 sentence story for an artisan named ${artisanName} who specializes in ${specialty} and is from ${location}. Focus on their passion, heritage, and what makes their work special.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "A passionate artisan dedicated to preserving traditional craftsmanship.";
  } catch (error) {
    console.error("Error generating artisan story:", error);
    throw new Error("Failed to generate artisan story");
  }
}