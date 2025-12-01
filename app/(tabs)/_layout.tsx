import { Tabs } from "expo-router";
import { ClipboardList, Lock, Sparkles } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarStyle: {
          backgroundColor: "#1f2937",
          borderTopColor: "#374151",
        },
        headerStyle: {
          backgroundColor: "#1f2937",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mis Tareas",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: "Bóveda",
          tabBarIcon: ({ color, size }) => (
            <Lock color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Asistente IA",
          tabBarIcon: ({ color, size }) => (
            <Sparkles color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}