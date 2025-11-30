import { View, Text, FlatList, TouchableOpacity, Alert, Animated, TextInput, Modal } from "react-native";
import { useVault } from "@/context/vault-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, LogOut, Lock, X, Shield } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VaultTasksScreen() {
  const { vaultTasks, lock, deleteVaultTask, toggleVaultTaskComplete, addVaultTask, isUnlocked } = useVault();
  const router = useRouter();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!isUnlocked) {
      router.replace("/(tabs)/vault");
      return;
    }

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
  }, [isUnlocked]);

  const handleLock = () => {
    Alert.alert(
      "🔒 Cerrar Bóveda", 
      "¿Deseas cerrar la bóveda?", 
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar",
          style: "destructive",
          onPress: () => {
            lock();
            router.replace("/(tabs)/vault");
          },
        },
      ]
    );
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "🗑️ Eliminar tarea privada",
      `¿Estás seguro de que quieres eliminar "${title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteVaultTask(id);
            Alert.alert("✅ Eliminada", "Tarea privada eliminada");
          },
        },
      ]
    );
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Error", "El título no puede estar vacío");
      return;
    }

    addVaultTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
    });

    setNewTaskTitle("");
    setNewTaskDescription("");
    setShowAddDialog(false);
    Alert.alert("✅ Creada", "Tarea privada agregada");
  };

  if (!isUnlocked) {
    return null;
  }

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
              <Shield color="#fff" size={24} />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">🔒 Bóveda Segura</Text>
              <Text className="text-gray-400 text-sm">{vaultTasks.length} tareas privadas</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleLock} 
            className="bg-red-600 px-4 py-2 rounded-full flex-row items-center"
          >
            <LogOut color="#fff" size={18} />
            <Text className="text-white font-bold ml-1">Cerrar</Text>
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
                <View className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#2D1560" }}>
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
                      className="p-2 bg-red-600 rounded-lg"
                    >
                      <Trash2 color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* Add Button */}
          <TouchableOpacity
            onPress={() => setShowAddDialog(true)}
            className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: "#9333ea", elevation: 5 }}
          >
            <Plus color="#fff" size={32} />
          </TouchableOpacity>
        </View>

        {/* Add Task Dialog */}
        <Modal
          visible={showAddDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddDialog(false)}
        >
          <View className="flex-1 bg-black/80 items-center justify-center px-6">
            <View className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-bold">Nueva Tarea Privada 🔒</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddDialog(false);
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                  }}
                  className="bg-gray-700 p-2 rounded-full"
                >
                  <X color="#fff" size={20} />
                </TouchableOpacity>
              </View>
              
              <Text className="text-gray-400 text-sm mb-2">Título *</Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 border border-purple-600"
                placeholder="Ej: Contraseña del banco"
                placeholderTextColor="#9ca3af"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                maxLength={100}
                autoFocus
              />
              
              <Text className="text-gray-400 text-sm mb-2">Descripción (opcional)</Text>
              <TextInput
                className="bg-gray-700 text-white px-4 py-3 rounded-lg mb-6 border border-purple-600"
                placeholder="Detalles adicionales..."
                placeholderTextColor="#9ca3af"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
              
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setShowAddDialog(false);
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                  }}
                  className="flex-1 bg-gray-700 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleAddTask}
                  className="flex-1 bg-purple-600 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-bold">Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
}