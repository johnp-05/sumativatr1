import { View, Text, FlatList, TouchableOpacity, Alert, Animated } from "react-native";
import { useVault } from "@/context/vault-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Edit, CheckCircle, Circle, LogOut, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VaultTasksScreen() {
  const { vaultTasks, lock, deleteVaultTask, toggleVaultTaskComplete, addVaultTask } = useVault();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLock = () => {
    Alert.alert("Cerrar Bóveda", "¿Deseas cerrar la bóveda?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar",
        onPress: () => {
          lock();
          router.back();
        },
      },
    ]);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Eliminar tarea privada",
      `¿Estás seguro de que quieres eliminar "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteVaultTask(id),
        },
      ]
    );
  };

  const handleCreateTask = () => {
    Alert.prompt(
      "Nueva Tarea Privada",
      "Ingresa el título de la tarea",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Crear",
          onPress: (title) => {
            if (title && title.trim()) {
              Alert.prompt(
                "Descripción",
                "Ingresa la descripción (opcional)",
                [
                  { text: "Omitir", style: "cancel", onPress: () => {
                    addVaultTask({ title: title.trim(), description: "", completed: false });
                  }},
                  {
                    text: "Crear",
                    onPress: (description) => {
                      addVaultTask({
                        title: title.trim(),
                        description: description || "",
                        completed: false,
                      });
                    },
                  },
                ]
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#200D4C" }}>
      <Animated.View 
        className="flex-1"
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        {/* Header */}
        <View className="px-4 py-6 flex-row items-center justify-between border-b" style={{ borderBottomColor: "#3D2080" }}>
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "#3D2080" }}>
              <Lock color="#fff" size={24} />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">Bóveda Segura</Text>
              <Text className="text-gray-400 text-sm">{vaultTasks.length} tareas privadas</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLock} className="p-2">
            <LogOut color="#ef4444" size={24} />
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <View className="flex-1 p-4">
          {vaultTasks.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Lock color="#6b7280" size={64} />
              <Text className="text-gray-400 text-lg mt-4 mb-2">No hay tareas privadas</Text>
              <Text className="text-gray-500 text-center">
                Presiona el botón + para crear una tarea privada
              </Text>
            </View>
          ) : (
            <FlatList
              data={vaultTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#2D1560" }}>
                  <View className="flex-row items-start">
                    <TouchableOpacity
                      onPress={() => toggleVaultTaskComplete(item.id)}
                      className="mr-3 mt-1"
                    >
                      {item.completed ? (
                        <CheckCircle color="#10b981" size={24} />
                      ) : (
                        <Circle color="#9333ea" size={24} />
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
                        <Text className="text-gray-300 mt-1">{item.description}</Text>
                      )}
                      <Text className="text-gray-500 text-xs mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDelete(item.id, item.title)}
                      className="p-2"
                    >
                      <Trash2 color="#ef4444" size={20} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            onPress={handleCreateTask}
            className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: "#9333ea", elevation: 5 }}
          >
            <Plus color="#fff" size={32} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}