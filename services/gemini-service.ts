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
      
      // Usar gemini-1.5-flash que es más estable
      const modelName = 'gemini-2.5-flash';
      console.log('📡 Usando modelo:', modelName);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
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
        if (errorMsg.includes('api key') || errorMsg.includes('api_key') || errorMsg.includes('invalid')) {
          throw new Error(
            '❌ API KEY INVÁLIDA\n\n' +
            'Tu API key no funciona.\n\n' +
            'Solución:\n' +
            '1. Ve a: https://aistudio.google.com/app/apikey\n' +
            '2. Crea una NUEVA key\n' +
            '3. Cópiala completa (empieza con AIzaSy...)\n' +
            '4. En .env pon: EXPO_PUBLIC_GEMINI_API_KEY=tu_key\n' +
            '5. Reinicia: npm start\n\n' +
            'Error original: ' + error.message
          );
        }
        
        // Error de modelo
        if (errorMsg.includes('model') || errorMsg.includes('not found')) {
          throw new Error(
            '❌ MODELO NO DISPONIBLE\n\n' +
            'Probando con modelo alternativo...\n\n' +
            'Si persiste:\n' +
            '1. Verifica tu API key\n' +
            '2. Revisa que tu cuenta de Google AI tenga acceso\n' +
            '3. Intenta en unos minutos\n\n' +
            'Error: ' + error.message
          );
        }
        
        // Error de red
        if (errorMsg.includes('fetch') || errorMsg.includes('network') || errorMsg.includes('failed')) {
          throw new Error(
            '❌ ERROR DE CONEXIÓN\n\n' +
            'No se puede conectar a Gemini.\n\n' +
            'Verifica:\n' +
            '1. Tu conexión a internet\n' +
            '2. Desactiva VPN si usas\n' +
            '3. Intenta con otra red\n\n' +
            'Error: ' + error.message
          );
        }
        
        // Error de quota
        if (errorMsg.includes('quota') || errorMsg.includes('limit') || errorMsg.includes('rate')) {
          throw new Error(
            '❌ LÍMITE EXCEDIDO\n\n' +
            'Has usado demasiadas peticiones.\n\n' +
            'Solución:\n' +
            '1. Espera 1 minuto\n' +
            '2. O crea una nueva API key\n\n' +
            'Error: ' + error.message
          );
        }
        
        throw new Error('❌ ERROR GEMINI:\n\n' + error.message);
      }
      
      throw new Error('Error desconocido al conectar con Gemini AI');
    }
  },

  async suggestTaskDescription(title: string): Promise<string> {
    console.log('🎯 === SUGERENCIA DE TAREA ===');
    console.log('Título:', title);
    
    const sanitizedTitle = sanitizeInput(title);
    const prompt = `Genera una descripción muy breve (máximo 50 palabras) para esta tarea: "${sanitizedTitle}". Responde SOLO con la descripción, sin comillas ni explicaciones.`;
    
    try {
      const response = await this.chat(prompt);
      const cleaned = response.replace(/["']/g, '').trim();
      console.log('✅ Sugerencia:', cleaned);
      return cleaned;
    } catch (error) {
      console.error('❌ Error en sugerencia:', error);
      throw error;
    }
  },
};