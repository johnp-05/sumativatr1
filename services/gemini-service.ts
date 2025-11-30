import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'EXPO_PUBLIC_GEMINI_API_KEY no está configurada.\n\n' +
      'Pasos para solucionar:\n' +
      '1. Crea un archivo .env en la raíz del proyecto\n' +
      '2. Añade: EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key\n' +
      '3. Obtén tu key en: https://aistudio.google.com/app/apikey\n' +
      '4. Reinicia el servidor: npm start'
    );
  }
  
  return new GoogleGenerativeAI(apiKey);
};

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>{}[\]\\]/g, '')
    .trim()
    .slice(0, 500);
}

export const geminiService = {
  async chat(prompt: string): Promise<string> {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      const sanitizedPrompt = sanitizeInput(prompt);
      const result = await model.generateContent(sanitizedPrompt);
      const response = result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Error en geminiService.chat:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
          throw new Error(
            'API Key inválida\n\n' +
            'Tu API key no es válida. Por favor:\n' +
            '1. Ve a https://aistudio.google.com/app/apikey\n' +
            '2. Genera una nueva API key\n' +
            '3. Actualiza el archivo .env\n' +
            '4. Reinicia el servidor'
          );
        }
        
        throw new Error(`Error al comunicarse con Gemini AI:\n${error.message}`);
      }
      
      throw new Error('Error desconocido al comunicarse con Gemini AI');
    }
  },

  async suggestTaskDescription(title: string): Promise<string> {
    const sanitizedTitle = sanitizeInput(title);
    const prompt = `Eres un asistente que ayuda a organizar tareas. Dado el título de una tarea "${sanitizedTitle}", sugiere una descripción breve y útil en español (máximo 80 caracteres). Responde SOLO con la descripción, sin comillas ni explicaciones adicionales.`;
    
    try {
      const response = await this.chat(prompt);
      return response.replace(/["']/g, '').trim();
    } catch (error) {
      console.error('Error al generar sugerencia:', error);
      throw error;
    }
  },
};
