import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useTasks } from "@/context/task-context";
import { useRouter } from "expo-router";
import { Plus, Trash2, Edit, CheckCircle, Circle, ClipboardList } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksScreen() {
  const { tasks, loading, deleteTask, toggleTaskComplete } = useTasks();
  const router = useRouter();

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      "Eliminar tarea",
      `¿Estás seguro de que quieres eliminar "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la tarea");
            }
          },
        },
      ]
    );
  };

  if (loading && tasks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-400 mt-4">Cargando tareas...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 p-4">
        {tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ClipboardList color="#6b7280" size={64} />
            <Text className="text-gray-400 text-lg mb-4 mt-4">No hay tareas</Text>
            <Text className="text-gray-500 text-center">
              Presiona el botón + para crear tu primera tarea
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/task/${item.id}`)}
                className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700"
              >
                <View className="flex-row items-start">
                  <TouchableOpacity
                    onPress={() => toggleTaskComplete(item.id)}
                    className="mr-3 mt-1"
                  >
                    {item.completed ? (
                      <CheckCircle color="#10b981" size={24} />
                    ) : (
                      <Circle color="#6b7280" size={24} />
                    )}
                  </TouchableOpacity>
                  
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-semibold ${
                        item.completed ? "text-gray-500 line-through" : "text-white"
                      }`}
                    >
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text className="text-gray-400 mt-1">{item.description}</Text>
                    )}
                    <Text className="text-gray-600 text-xs mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <View className="flex-row ml-2">
                    <TouchableOpacity
                      onPress={() => router.push(`/task/${item.id}`)}
                      className="p-2"
                    >
                      <Edit color="#3b82f6" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id, item.title)}
                      className="p-2"
                    >
                      <Trash2 color="#ef4444" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          onPress={() => router.push("/task/create")}
          className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{ elevation: 5 }}
        >
          <Plus color="#fff" size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}