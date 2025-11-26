import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'EXPO_PUBLIC_GEMINI_API_KEY no está configurada. Por favor, añade tu API key en el archivo .env'
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

export const geminiService = {
  async chat(prompt: string): Promise<string> {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al comunicarse con Gemini AI: ${error.message}`);
      }
      throw new Error('Error desconocido al comunicarse con Gemini AI');
    }
  },

  async suggestTaskDescription(title: string): Promise<string> {
    const prompt = `Dado el título de una tarea "${title}", sugiere una breve descripción para esta tarea. La descripción debe ser concisa (máximo 100 caracteres) y útil. Responde solo con la descripción, sin explicaciones adicionales.`;
    return this.chat(prompt);
  },
};
