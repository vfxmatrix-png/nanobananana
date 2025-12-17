import { GoogleGenAI } from "@google/genai";
import { cleanBase64 } from "../utils";

// Initialize the client. API Key is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * edits an image using the Gemini 2.5 Flash Image model (Nano Banana).
 * 
 * @param imageBase64 The original image in base64 format.
 * @param prompt The user's instruction for editing.
 * @returns The generated image base64 string.
 */
export const editImageWithGemini = async (
  imageBase64: string, 
  prompt: string
): Promise<string> => {
  try {
    const { mimeType, data } = cleanBase64(imageBase64);

    // Using the specific model requested: 'gemini-2.5-flash-image' (Nano Banana)
    // This model supports image input + text prompt to generate a new image (edit).
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Configuration for image generation
      config: {
        // Nano Banana specific configs can go here if needed, 
        // but defaults work well for general editing.
      }
    });

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct the data URI for the new image
          // The API typically returns standard MIME types like image/jpeg or image/png
          const returnMime = part.inlineData.mimeType || 'image/png';
          return `data:${returnMime};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response. The model might have refused the request or returned text only.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`AI Editing Failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while contacting Gemini.");
  }
};