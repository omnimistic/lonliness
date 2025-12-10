import { GoogleGenAI, Type } from "@google/genai";
import { ChartDataPoint, GroundingMetadata } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Ensure process.env.API_KEY is available.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

// 1. Generate Statistics Data (JSON Mode)
export const fetchLonelinessTrends = async (): Promise<ChartDataPoint[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a JSON dataset representing the rise of reported loneliness percentages in adults from 2018 to 2024. Provide 7 data points.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING },
              value: { type: Type.NUMBER, description: "Percentage of adults reporting loneliness" },
              label: { type: Type.STRING, description: "Short context (e.g., 'Pandemic peak')" }
            },
            required: ["year", "value", "label"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Fallback data
    return [
      { year: "2018", value: 54, label: "Pre-pandemic" },
      { year: "2019", value: 61, label: "Rising trend" },
      { year: "2020", value: 73, label: "Global Lockdowns" },
      { year: "2021", value: 68, label: "Partial reopening" },
      { year: "2022", value: 65, label: "New Normal" },
      { year: "2023", value: 58, label: "Hybrid connection" },
      { year: "2024", value: 60, label: "Digital fatigue" },
    ];
  }
};

// 2. Chat Companion (Stream)
export const streamChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a supportive, empathetic friend helping the user navigate feelings of loneliness. Offer active listening and gentle suggestions for social connection.",
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    onChunk("I'm having trouble connecting right now. Please try again.");
  }
};

// 3. Find Community (Maps Grounding)
export const findCommunityResources = async (query: string, lat?: number, lng?: number): Promise<{ text: string; grounding?: GroundingMetadata }> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Configure tools
    const tools = [{ googleMaps: {} }];
    let toolConfig = undefined;

    if (lat && lng) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: `Find 3 local places or events relevant to: ${query}. Focus on community centers, social clubs, parks, or volunteer opportunities where people can meet.`,
      config: {
        tools,
        toolConfig,
      }
    });

    return {
      text: response.text || "No specific locations found.",
      grounding: response.candidates?.[0]?.groundingMetadata
    };

  } catch (error) {
    console.error("Maps error:", error);
    return { text: "Unable to search for locations at this time. Please check your location settings." };
  }
};
