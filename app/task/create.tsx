import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTasks } from "@/context/task-context";
import { Sparkles, Save, Lightbulb } from "lucide-react-native";
import { geminiService } from "@/services/gemini-service";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addTask } = useTasks();
  const router = useRouter();

  const handleSuggestDescription = async () => {
    if (!title || title.trim().length < 3) {
      Alert.alert("Error", "Primero ingresa un título (mínimo 3 caracteres)");
      return;
    }

    setLoadingAI(true);
    console.log('🤖 === INICIANDO SUGERENCIA DE IA ===');
    console.log('Título:', title);
    
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout de 20 segundos alcanzado');
      setLoadingAI(false);
      Alert.alert(
        "Timeout", 
        "La IA está tardando mucho.\n\nVerifica:\n1. Tu conexión a internet\n2. Que la API key sea válida\n3. Intenta de nuevo"
      );
    }, 20000);
    
    try {
      const suggestion = await geminiService.suggestTaskDescription(title);
      clearTimeout(timeoutId);
      
      console.log('✅ Sugerencia recibida:', suggestion);
      setDescription(suggestion);
      Alert.alert("Listo", "Descripción generada con IA");
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ === ERROR EN SUGERENCIA ===');
      console.error(error);
      
      let errorMessage = "No se pudo generar la sugerencia.";
      
      if (error instanceof Error) {
        console.error('Tipo:', error.name);
        console.error('Mensaje:', error.message);
        
        if (error.message.includes('GEMINI NO CONFIGURADO')) {
          errorMessage = error.message;
        } else if (error.message.includes('API KEY INVÁLIDA')) {
          errorMessage = error.message;
        } else if (error.message.includes('ERROR DE RED')) {
          errorMessage = error.message;
        } else {
          errorMessage = `Error: ${error.message}\n\nRevisa la consola para más detalles.`;
        }
      }
      
      Alert.alert("Error de IA", errorMessage);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    if (!title || title.trim().length < 3) {
      Alert.alert("Error", "El título debe tener al menos 3 caracteres");
      return;
    }

    setSaving(true);
    console.log('💾 Guardando tarea:', { title, description });

    try {
      const newTask = await addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      
      console.log('✅ Tarea guardada:', newTask);
      router.back();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      Alert.alert("Error", "No se pudo crear la tarea");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = saving || loadingAI;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <Text className="text-white text-3xl font-bold mb-6">Nueva Tarea</Text>

        {/* TÍTULO */}
        <View className="mb-6">
          <Text className="text-gray-300 text-sm mb-2 font-medium">
            Título <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            placeholder="Ej: Estudiar para el examen"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!isDisabled}
          />
          <Text className="text-gray-500 text-xs mt-1">{title.length}/100</Text>
        </View>

        {/* DESCRIPCIÓN CON BOTÓN IA */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-sm font-medium">Descripción</Text>
            <TouchableOpacity
              onPress={handleSuggestDescription}
              disabled={isDisabled || !title.trim() || title.trim().length < 3}
              className={`flex-row items-center px-3 py-2 rounded-full ${
                isDisabled || !title.trim() || title.trim().length < 3 ? "bg-gray-700" : "bg-purple-600"
              }`}
            >
              {loadingAI ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white text-xs ml-2 font-medium">Generando...</Text>
                </>
              ) : (
                <>
                  <Sparkles color="#fff" size={14} />
                  <Text className="text-white text-xs ml-1 font-medium">Sugerir con IA</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
            placeholder="Descripción (opcional)"
            placeholderTextColor="#6b7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
            editable={!isDisabled}
          />
          <Text className="text-gray-500 text-xs mt-1">{description.length}/500</Text>
        </View>

        {/* INFO */}
        <View className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6 flex-row items-start">
          <Lightbulb color="#93c5fd" size={20} />
          <Text className="text-blue-300 text-sm ml-2 flex-1">
            Tip: Usa el botón "Sugerir con IA" para generar una descripción automática basada en el título
          </Text>
        </View>

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isDisabled || !title.trim() || title.trim().length < 3}
          className={`bg-blue-600 py-4 rounded-lg flex-row items-center justify-center mb-3 ${
            (isDisabled || !title.trim() || title.trim().length < 3) ? "opacity-50" : ""
          }`}
        >
          {saving ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white text-lg font-semibold ml-2">Guardando...</Text>
            </>
          ) : (
            <>
              <Save color="#fff" size={20} />
              <Text className="text-white text-lg font-semibold ml-2">Guardar Tarea</Text>
            </>
          )}
        </TouchableOpacity>

        {/* BOTÓN CANCELAR */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isDisabled}
          className={`bg-gray-700 py-4 rounded-lg ${isDisabled ? "opacity-50" : ""}`}
        >
          <Text className="text-white text-lg font-semibold text-center">Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}