import { GoogleGenAI } from "@google/genai";
import { CartItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getChefNote = async (items: CartItem[]): Promise<string> => {
  if (items.length === 0) return "";

  const itemNames = items.map(i => i.name).join(", ");
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The customer has ordered: ${itemNames}. 
      Act as a quirky, friendly cafe barista. Write a very short (max 15 words) fun comment complimenting their taste or suggesting a vibe. 
      Do not list ingredients. Just a fun one-liner.`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great choice! Enjoy your meal.";
  }
};
