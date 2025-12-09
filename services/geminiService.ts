import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePatientData = async (): Promise<any> => {
  if (!apiKey) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a realistic dummy patient profile for a medical software test. Return JSON only.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.INTEGER },
            gender: { type: Type.STRING, enum: ["Male", "Female", "Other"] },
            contact: { type: Type.STRING },
            history: { type: Type.STRING, description: "Brief medical history summary" }
          },
          required: ["name", "age", "gender", "contact", "history"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getAIClinicalSuggestion = async (symptoms: string, history: string): Promise<string> => {
  if (!apiKey) return "AI Service Unavailable (Missing API Key)";

  try {
    const prompt = `
      Act as a senior clinical assistant.
      Patient History: ${history}
      Current Symptoms/Notes: ${symptoms}
      
      Provide a brief, structured suggestion including:
      1. Potential Diagnosis
      2. Recommended Tests
      3. Suggested Treatment Plan (Generic)
      
      Keep it professional and concise (under 200 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No suggestion generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating clinical suggestion.";
  }
};