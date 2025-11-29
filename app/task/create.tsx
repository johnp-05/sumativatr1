import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTasks } from "@/context/task-context";
import { taskSchema } from "@/lib/schemas/task.schema";
import { Sparkles, Save, Info } from "lucide-react-native";
import { geminiService } from "@/services/gemini-service";

export default function CreateTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [loadingAI, setLoadingAI] = useState(false);
  const { addTask, loading } = useTasks();
  const router = useRouter();

  const validateForm = (): boolean => {
    try {
      taskSchema.parse({ title, description, completed: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: { title?: string; description?: string } = {};
      error.errors.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'title' | 'description'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSuggestDescription = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Primero ingresa un título para la tarea");
      return;
    }

    setLoadingAI(true);
    try {
      const suggestion = await geminiService.suggestTaskDescription(title);
      setDescription(suggestion);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar la sugerencia. Verifica tu API key de Gemini.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la tarea");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <Text className="text-white text-3xl font-bold mb-6">Nueva Tarea</Text>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-300 text-sm mb-2 font-medium">
            Título <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={`bg-gray-800 text-white px-4 py-3 rounded-lg border ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Ej: Estudiar para el examen"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            maxLength={100}
          />
          {errors.title && (
            <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
          )}
          <Text className="text-gray-500 text-xs mt-1">{title.length}/100</Text>
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-sm font-medium">Descripción</Text>
            <TouchableOpacity
              onPress={handleSuggestDescription}
              disabled={loadingAI}
              className="flex-row items-center bg-purple-600 px-3 py-1 rounded-full"
            >
              {loadingAI ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Sparkles color="#fff" size={14} />
                  <Text className="text-white text-xs ml-1 font-medium">Sugerir con IA</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            className={`bg-gray-800 text-white px-4 py-3 rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Descripción de la tarea (opcional)"
            placeholderTextColor="#6b7280"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          {errors.description && (
            <Text className="text-red-500 text-xs mt-1">{errors.description}</Text>
          )}
          <Text className="text-gray-500 text-xs mt-1">{description.length}/500</Text>
        </View>

        {/* Info Box */}
        <View className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6 flex-row items-start">
          <Info color="#60a5fa" size={20} className="mt-0.5 mr-3" />
          <Text className="text-blue-300 text-sm flex-1">
            Los campos deben contener solo letras, números y signos de puntuación básicos (. , ! ? ( ) -)
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className={`bg-blue-600 py-4 rounded-lg flex-row items-center justify-center ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Save color="#fff" size={20} />
              <Text className="text-white text-lg font-semibold ml-2">Guardar Tarea</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}