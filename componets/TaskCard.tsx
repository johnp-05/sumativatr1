import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle, Circle, Edit, Trash2 } from "lucide-react-native";

interface TaskCardProps {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  variant?: "normal" | "vault";
}

export default function TaskCard({
  title,
  description,
  completed,
  createdAt,
  onToggleComplete,
  onEdit,
  onDelete,
  variant = "normal",
}: TaskCardProps) {
  const bgColor = variant === "vault" ? "bg-[#2D1560]" : "bg-gray-800";
  const borderColor = variant === "vault" ? "border-[#3D2080]" : "border-gray-700";
  const checkColor = variant === "vault" ? "#9333ea" : "#6b7280";

  return (
    <TouchableOpacity onPress={onEdit} className={`${bgColor} rounded-xl p-4 mb-3 border ${borderColor}`}>
      <View className="flex-row items-start">
        <TouchableOpacity onPress={onToggleComplete} className="mr-3 mt-1">
          {completed ? (
            <CheckCircle color="#10b981" size={24} />
          ) : (
            <Circle color={checkColor} size={24} />
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${
              completed ? "text-gray-500 line-through" : "text-white"
            }`}
          >
            {title}
          </Text>
          {description && (
            <Text className={variant === "vault" ? "text-gray-300 mt-1" : "text-gray-400 mt-1"}>
              {description}
            </Text>
          )}
          <Text className={variant === "vault" ? "text-gray-500 text-xs mt-2" : "text-gray-600 text-xs mt-2"}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View className="flex-row ml-2">
          <TouchableOpacity onPress={onEdit} className="p-2">
            <Edit color="#3b82f6" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} className="p-2">
            <Trash2 color="#ef4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}