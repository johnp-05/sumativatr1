import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useTasks } from "@/context/task-context";
import { Sparkles, Save } from "lucide-react-native";
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
    
    try {
      const suggestion = await geminiService.suggestTaskDescription(title);
      setDescription(suggestion);
      Alert.alert("✅ ¡Listo!", "Descripción generada con IA");
    } catch (error) {
      console.error("Error IA:", error);
      Alert.alert(
        "❌ Error de IA", 
        error instanceof Error ? error.message : "Verifica tu API key de Gemini"
      );
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

    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      
      Alert.alert(
        "✅ ¡Éxito!", 
        "Tarea creada correctamente",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo crear la tarea");
    } finally {
      setSaving(false);
    }
  };

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
            editable={!saving && !loadingAI}
          />
          <Text className="text-gray-500 text-xs mt-1">{title.length}/100</Text>
        </View>

        {/* DESCRIPCIÓN CON BOTÓN IA */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 text-sm font-medium">Descripción</Text>
            <TouchableOpacity
              onPress={handleSuggestDescription}
              disabled={loadingAI || saving || !title.trim()}
              className={`flex-row items-center px-4 py-2 rounded-full ${
                loadingAI || saving || !title.trim() ? "bg-gray-700" : "bg-purple-600"
              }`}
            >
              {loadingAI ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white text-sm ml-2 font-bold">Generando...</Text>
                </>
              ) : (
                <>
                  <Sparkles color="#fff" size={16} />
                  <Text className="text-white text-sm ml-2 font-bold">Sugerir con IA</Text>
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
            editable={!saving && !loadingAI}
          />
          <Text className="text-gray-500 text-xs mt-1">{description.length}/500</Text>
        </View>

        {/* INFO */}
        <View className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 mb-6">
          <Text className="text-purple-300 text-sm">
            💡 <Text className="font-bold">Tip:</Text> Usa &quot;Sugerir con IA&quot; para generar una descripción automática
          </Text>
        </View>

        {/* BOTONES */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || loadingAI}
          className={`bg-blue-600 py-4 rounded-lg flex-row items-center justify-center mb-3 ${
            (saving || loadingAI) ? "opacity-50" : ""
          }`}
        >
          {saving ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white text-lg font-bold ml-2">Guardando...</Text>
            </>
          ) : (
            <>
              <Save color="#fff" size={20} />
              <Text className="text-white text-lg font-bold ml-2">Guardar Tarea</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          disabled={saving || loadingAI}
          className="bg-gray-700 py-4 rounded-lg"
        >
          <Text className="text-white text-lg font-semibold text-center">Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}