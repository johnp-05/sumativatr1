import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  console.log('🔑 === VERIFICANDO GEMINI ===');
  console.log('API Key presente:', apiKey ? 'SÍ (' + apiKey.substring(0, 10) + '...)' : 'NO');
  
  if (!apiKey || apiKey === '' || apiKey === 'tu_api_key_aqui') {
    throw new Error(
      'GEMINI NO CONFIGURADO\n\n' +
      'Pasos:\n' +
      '1. Crea .env en la raíz del proyecto\n' +
      '2. Añade: EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...\n' +
      '3. Obtén key: https://aistudio.google.com/app/apikey\n' +
      '4. Reinicia: npm start'
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
    console.log('💬 === CHAT CON GEMINI ===');
    console.log('Prompt:', prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''));
    
    try {
      const genAI = getGeminiClient();
      
      // Intentar primero con gemini-1.5-flash
      let modelName = 'gemini-1.5-flash';
      console.log('📡 Usando modelo:', modelName);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      
      console.log('📤 Enviando a Gemini...');
      const sanitizedPrompt = sanitizeInput(prompt);
      
      const result = await model.generateContent(sanitizedPrompt);
      
      console.log('📥 Respuesta recibida');
      const response = result.response;
      const text = response.text();
      
      console.log('✅ Texto extraído:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      
      return text;
    } catch (error) {
      console.error('❌ === ERROR EN GEMINI ===');
      console.error('Error completo:', error);
      
      if (error instanceof Error) {
        console.error('Tipo:', error.name);
        console.error('Mensaje:', error.message);
        
        const errorMsg = error.message.toLowerCase();
        
        // Error de API Key
        if (errorMsg.includes('api key') || errorMsg.includes('api_key')) {
          throw new Error(
            'API KEY INVÁLIDA\n\n' +
            'Tu API key no funciona o expiró.\n\n' +
            'Solución:\n' +
            '1. Ve a: https://aistudio.google.com/app/apikey\n' +
            '2. Borra la key anterior si existe\n' +
            '3. Crea una NUEVA key\n' +
            '4. Cópiala COMPLETA\n' +
            '5. Pégala en .env\n' +
            '6. Reinicia la app'
          );
        }
        
        // Error de modelo
        if (errorMsg.includes('model') || errorMsg.includes('not found')) {
          throw new Error(
            'MODELO NO DISPONIBLE\n\n' +
            'El modelo de IA no está disponible.\n\n' +
            'Esto puede ser temporal. Intenta:\n' +
            '1. Esperar unos minutos\n' +
            '2. Intentar de nuevo\n' +
            '3. Verificar tu API key'
          );
        }
        
        // Error de red
        if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('failed')) {
          throw new Error(
            'ERROR DE RED\n\n' +
            'No se puede conectar a Gemini.\n\n' +
            'Verifica:\n' +
            '1. Conexión a internet\n' +
            '2. ¿Estás usando VPN? Desactívala\n' +
            '3. ¿Estás en China/país con restricciones?\n' +
            '4. Intenta con datos móviles'
          );
        }
        
        // Error de quota
        if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
          throw new Error(
            'LÍMITE EXCEDIDO\n\n' +
            'Has alcanzado el límite de la API.\n\n' +
            'Solución:\n' +
            '1. Espera unos minutos\n' +
            '2. O crea una nueva API key'
          );
        }
        
        // Error genérico pero con mensaje útil
        throw new Error(`ERROR GEMINI:\n\n${error.message}`);
      }
      
      throw new Error('Error desconocido al conectar con Gemini AI');
    }
  },

  async suggestTaskDescription(title: string): Promise<string> {
    console.log('🎯 === SUGERENCIA DE TAREA ===');
    console.log('Título:', title);
    
    const sanitizedTitle = sanitizeInput(title);
    const prompt = `Eres un asistente útil. Para la tarea "${sanitizedTitle}", escribe UNA descripción breve en español (máximo 60 caracteres). Responde SOLO la descripción, sin comillas.`;
    
    try {
      const response = await this.chat(prompt);
      const cleaned = response.replace(/["']/g, '').trim();
      console.log('✅ Sugerencia final:', cleaned);
      return cleaned;
    } catch (error) {
      console.error('❌ Error en sugerencia:', error);
      throw error;
    }
  },
};