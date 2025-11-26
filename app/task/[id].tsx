import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTasks } from "@/context/task-context";
import { taskSchema } from "@/lib/schemas/task.schema";
import { Save, Trash2 } from "lucide-react-native";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const { tasks, updateTask, deleteTask, loading } = useTasks();
  const router = useRouter();

  const task = tasks.find((t) => t.id === Number(id));

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

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

  const handleSave = async () => {
    if (!validateForm() || !task) {
      return;
    }

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert("Eliminar tarea", `¿Estás seguro de que quieres eliminar "${task.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(task.id);
            router.back();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar la tarea");
          }
        },
      },
    ]);
  };

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-lg">Tarea no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <Text className="text-white text-3xl font-bold mb-6">Editar Tarea</Text>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-300 text-sm mb-2 font-medium">
            Título <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={`bg-gray-800 text-white px-4 py-3 rounded-lg border ${
              errors.title ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="Título de la tarea"
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
          <Text className="text-gray-300 text-sm mb-2 font-medium">Descripción</Text>
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

        {/* Task Info */}
        <View className="bg-gray-800 rounded-lg p-4 mb-6">
          <Text className="text-gray-400 text-sm">
            Creada: {new Date(task.createdAt).toLocaleDateString()} a las{" "}
            {new Date(task.createdAt).toLocaleTimeString()}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Estado: {task.completed ? "✅ Completada" : "⏳ Pendiente"}
          </Text>
        </View>

        {/* Buttons */}
        <View className="gap-3">
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
                <Text className="text-white text-lg font-semibold ml-2">Guardar Cambios</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading}
            className="bg-red-600 py-4 rounded-lg flex-row items-center justify-center"
          >
            <Trash2 color="#fff" size={20} />
            <Text className="text-white text-lg font-semibold ml-2">Eliminar Tarea</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}