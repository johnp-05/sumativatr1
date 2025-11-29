import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { Send, Sparkles, Bot, User, TestTube2, CheckCircle2, MessageSquare, Lightbulb, Target } from "lucide-react-native";
import { geminiService } from "@/services/gemini-service";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ExploreScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hola! Soy tu asistente con IA Gemini. Puedo ayudarte a:\n\nOrganizar tus tareas\nDarte consejos de productividad\nResponder tus preguntas\nCrear descripciones para tus tareas\n\nEn qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const testConnection = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        Alert.alert(
          "API Key no encontrada",
          "Para configurar Gemini AI:\n\n" +
          "1. Ve a: https://aistudio.google.com/app/apikey\n" +
          "2. Crea una API key\n" +
          "3. Crea un archivo .env en la raíz\n" +
          "4. Añade: EXPO_PUBLIC_GEMINI_API_KEY=tu_key\n" +
          "5. Reinicia: npm start",
          [{ text: "Entendido" }]
        );
        setLoading(false);
        return;
      }

      Alert.alert("Probando conexión", "Verificando Gemini AI...");
      
      const response = await geminiService.chat("Di 'Hola' en una palabra");
      
      Alert.alert(
        "Gemini AI funciona correctamente",
        `Respuesta: "${response}"\n\n` +
        "La inteligencia artificial está configurada correctamente. " +
        "Ahora puedes chatear con el asistente.",
        [{ text: "Genial" }]
      );
    } catch (error) {
      console.error('Error en test:', error);
      Alert.alert(
        "Error de conexión",
        error instanceof Error ? error.message : "Error desconocido",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await geminiService.chat(inputText.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mr-3">
                <Sparkles color="#fff" size={24} />
              </View>
              <View>
                <Text className="text-white text-xl font-bold">Asistente IA</Text>
                <Text className="text-gray-400 text-sm">Powered by Gemini</Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={testConnection}
              disabled={loading}
              className={`px-3 py-2 rounded-lg flex-row items-center ${
                loading ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#9333ea" />
              ) : (
                <>
                  <TestTube2 color="#9333ea" size={16} />
                  <Text className="text-purple-400 text-xs ml-1 font-medium">Probar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 flex-row ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <View className="w-8 h-8 bg-purple-600 rounded-full items-center justify-center mr-2">
                  <Bot color="#fff" size={16} />
                </View>
              )}
              
              <View
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.isUser
                    ? "bg-blue-600"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <Text className="text-white leading-5">{message.text}</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              {message.isUser && (
                <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center ml-2">
                  <User color="#fff" size={16} />
                </View>
              )}
            </View>
          ))}

          {loading && (
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-purple-600 rounded-full items-center justify-center mr-2">
                <Bot color="#fff" size={16} />
              </View>
              <View className="bg-gray-800 border border-gray-700 p-3 rounded-2xl flex-row items-center">
                <ActivityIndicator color="#fff" size="small" />
                <Text className="text-white ml-2">Pensando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 py-4 border-t border-gray-800">
          <View className="flex-row items-center bg-gray-800 rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-white py-2"
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#6b7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim() && !loading ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Send color="#fff" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-xs text-center mt-2">
            Gemini puede cometer errores. Verifica información importante.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}