import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { Send, Sparkles, Bot, User, Zap } from "lucide-react-native";
import { geminiService, TaskManagementFunctions } from "@/services/gemini-service";
import { useTasks } from "@/context/task-context";
import { useVault } from "@/context/vault-context";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'info' | 'success' | 'error' | 'warning';
}

export default function ExploreScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👋 Soy tu asistente inteligente con IA Gemini.\n\n" +
            "**Puedo ayudarte con:**\n\n" +
            "📋 Ver tus tareas: \"Muéstrame mis tareas\"\n" +
            "➕ Crear tareas: \"Crea una tarea llamada X\"\n" +
            "✏️ Editar tareas: \"Actualiza la tarea #3\"\n" +
            "🗑️ Eliminar tareas: \"Elimina la tarea #5\"\n" +
            "🔐 Gestión de bóveda: \"Mueve la tarea #2 a la bóveda\"\n" +
            "⚡ Comando especial: Escribe \"concedido\" para mover la última tarea mencionada a la bóveda\n\n" +
            "¿Qué necesitas hacer hoy?",
      isUser: false,
      timestamp: new Date(),
      type: 'info'
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Hooks para acceso a tareas
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask,
    loading: tasksLoading 
  } = useTasks();
  
  const { 
    vaultTasks, 
    addVaultTask, 
    updateVaultTask, 
    deleteVaultTask,
    isUnlocked: isVaultUnlocked
  } = useVault();

  // Crear funciones de gestión de tareas para Gemini
  const taskFunctions: TaskManagementFunctions = {
    getNormalTasks: async () => tasks,
    getVaultTasks: async () => vaultTasks,
    
    createTask: async (title: string, description: string, isVault: boolean) => {
      if (isVault) {
        const newTask = {
          id: Date.now().toString(),
          title,
          description,
          completed: false,
          createdAt: new Date().toISOString()
        };
        await addVaultTask({ title, description, completed: false });
        return newTask;
      } else {
        return await addTask({ title, description, completed: false });
      }
    },
    
    updateTask: async (id: string | number, updates: any, isVault: boolean) => {
      if (isVault) {
        await updateVaultTask(id.toString(), updates);
        return { id, ...updates };
      } else {
        return await updateTask(Number(id), updates);
      }
    },
    
    deleteTask: async (id: string | number, isVault: boolean) => {
      if (isVault) {
        await deleteVaultTask(id.toString());
      } else {
        await deleteTask(Number(id));
      }
    },
    
    moveToVault: async (id: number, task: any) => {
      // Crear tarea en bóveda
      await addVaultTask({
        title: task.title,
        description: task.description || '',
        completed: task.completed
      });
      
      // Eliminar de tareas normales
      await deleteTask(id);
    },
    
    isVaultUnlocked: () => isVaultUnlocked
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    console.log('💬 Usuario envió:', userMessage.text);
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await geminiService.chatWithTaskManagement(
        currentInput,
        taskFunctions
      );
      
      console.log('✅ IA respondió:', response.substring(0, 50) + '...');
      
      // Detectar tipo de mensaje según el contenido
      let messageType: 'info' | 'success' | 'error' | 'warning' = 'info';
      if (response.includes('✅') || response.includes('exitosamente')) {
        messageType = 'success';
      } else if (response.includes('❌') || response.includes('Error')) {
        messageType = 'error';
      } else if (response.includes('⚠️') || response.includes('Confirmación')) {
        messageType = 'warning';
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        type: messageType
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      
      let errorText = "Lo siento, hubo un error. Por favor intenta de nuevo.";
      
      if (error instanceof Error) {
        errorText = error.message;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ **Error**\n\n${errorText}`,
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/30 border-green-700';
      case 'error':
        return 'bg-red-900/30 border-red-700';
      case 'warning':
        return 'bg-yellow-900/30 border-yellow-700';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  const quickActions = [
    { text: "Muéstrame mis tareas", icon: "📋" },
    { text: "Crea una tarea", icon: "➕" },
    { text: "Ver tareas de la bóveda", icon: "🔐" },
  ];

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
                <Text className="text-white text-xl font-bold">Asistente IA Mejorado</Text>
                <Text className="text-gray-400 text-sm">Gestión inteligente de tareas</Text>
              </View>
            </View>
            
            <View className="bg-purple-900/50 px-3 py-1 rounded-full">
              <Text className="text-purple-300 text-xs font-bold">
                {tasks.length} tareas
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <View className="px-4 py-3 border-b border-gray-800">
            <Text className="text-gray-400 text-xs mb-2">ACCIONES RÁPIDAS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setInputText(action.text);
                  }}
                  className="bg-gray-800 px-4 py-2 rounded-full mr-2 flex-row items-center border border-gray-700"
                >
                  <Text className="text-white mr-1">{action.icon}</Text>
                  <Text className="text-gray-300 text-sm">{action.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
                <View className="w-8 h-8 bg-purple-600 rounded-full items-center justify-center mr-2 mt-1">
                  <Bot color="#fff" size={16} />
                </View>
              )}
              
              <View
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? "bg-blue-600"
                    : `${getMessageStyle(message.type)} border`
                }`}
              >
                <Text className="text-white leading-5 whitespace-pre-line">{message.text}</Text>
                <Text className="text-gray-400 text-xs mt-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              {message.isUser && (
                <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center ml-2 mt-1">
                  <User color="#fff" size={16} />
                </View>
              )}
            </View>
          ))}

          {loading && (
            <View className="flex-row items-start mb-4">
              <View className="w-8 h-8 bg-purple-600 rounded-full items-center justify-center mr-2">
                <Bot color="#fff" size={16} />
              </View>
              <View className="bg-gray-800 border border-gray-700 p-3 rounded-2xl flex-row items-center">
                <ActivityIndicator color="#9333ea" size="small" />
                <Text className="text-white ml-2">Procesando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 py-4 border-t border-gray-800">
          {/* Tip del comando especial */}
          {!loading && messages.length > 1 && (
            <View className="bg-purple-900/30 border border-purple-700 rounded-lg px-3 py-2 mb-3 flex-row items-center">
              <Zap color="#a855f7" size={16} />
              <Text className="text-purple-300 text-xs ml-2 flex-1">
                <Text className="font-bold">Comando especial:</Text> Escribe "concedido" para mover la última tarea a la bóveda
              </Text>
            </View>
          )}
          
          <View className="flex-row items-center bg-gray-800 rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-white py-2"
              placeholder="Escribe tu mensaje o comando..."
              placeholderTextColor="#6b7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!loading}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                inputText.trim() && !loading ? "bg-purple-600" : "bg-gray-700"
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