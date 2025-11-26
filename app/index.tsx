import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "@/context/task-context";
import { Plus, MessageSquare, Trash2, CheckCircle2, Circle } from "lucide-react-native";

export default function Index() {
  const router = useRouter();
  const { tasks, loading, error, deleteTask, toggleTaskComplete } = useTasks();

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      "Eliminar tarea",
      `¿Estás seguro de que deseas eliminar "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTaskComplete(id);
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {error && (
        <View className="bg-red-100 border border-red-400 px-4 py-3 m-4 rounded">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-gray-500 text-lg mb-2">No hay tareas</Text>
            <Text className="text-gray-400 text-center">
              Presiona el botón + para crear una nueva tarea
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/task/${item.id}`)}
            className={`bg-white rounded-lg p-4 mb-3 shadow-sm border ${
              item.completed ? "border-green-200" : "border-gray-200"
            }`}
          >
            <View className="flex-row items-start">
              <TouchableOpacity
                onPress={() => handleToggleComplete(item.id)}
                className="mr-3 pt-1"
              >
                {item.completed ? (
                  <CheckCircle2 color="#10b981" size={24} />
                ) : (
                  <Circle color="#9ca3af" size={24} />
                )}
              </TouchableOpacity>

              <View className="flex-1">
                <Text
                  className={`text-lg font-semibold ${
                    item.completed ? "text-gray-400 line-through" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </Text>
                {item.description && (
                  <Text
                    className={`text-sm mt-1 ${
                      item.completed ? "text-gray-400" : "text-gray-600"
                    }`}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}
                <Text className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.title)}
                className="ml-2 p-2"
              >
                <Trash2 color="#ef4444" size={20} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Botón flotante para crear tarea */}
      <TouchableOpacity
        onPress={() => router.push("/task/create")}
        className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-16 h-16 items-center justify-center shadow-lg"
      >
        <Plus color="#fff" size={32} />
      </TouchableOpacity>

      {/* Botón flotante para Gemini AI */}
      <TouchableOpacity
        onPress={() => router.push("/gemini")}
        className="absolute bottom-6 left-6 bg-purple-500 rounded-full w-16 h-16 items-center justify-center shadow-lg"
      >
        <MessageSquare color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}