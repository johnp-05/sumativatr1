import { Stack } from "expo-router";
import { TaskProvider } from "@/context/task-context";
import { VaultProvider } from "@/context/vault-context";
import "../global.css";

export default function RootLayout() {
  return (
    <TaskProvider>
      <VaultProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="task/[id]" 
            options={{ 
              presentation: "modal",
              headerShown: true,
              title: "Editar Tarea",
              headerStyle: {
                backgroundColor: "#1f2937",
              },
              headerTintColor: "#fff",
            }} 
          />
          <Stack.Screen 
            name="task/create" 
            options={{ 
              presentation: "modal",
              headerShown: true,
              title: "Nueva Tarea",
              headerStyle: {
                backgroundColor: "#1f2937",
              },
              headerTintColor: "#fff",
            }} 
          />
          <Stack.Screen 
            name="vault/tasks" 
            options={{ 
              presentation: "fullScreenModal",
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="test-gemini" 
            options={{ 
              presentation: "modal",
              headerShown: false
            }} 
          />
        </Stack>
      </VaultProvider>
    </TaskProvider>
  );
}