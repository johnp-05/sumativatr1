import { View, Text, TouchableOpacity, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVault } from "@/context/vault-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Delete, Shield } from "lucide-react-native";

export default function VaultAccessScreen() {
  const { unlock, hasPin, isUnlocked } = useVault();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      router.push("/vault/tasks");
    }
  }, [isUnlocked]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");

      if (newPin.length === 6) {
        setTimeout(() => {
          const success = unlock(newPin);
          if (!success) {
            setError("❌ PIN incorrecto");
            shake();
            setPin("");
          } else {
            setError("✅ Acceso concedido");
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError("");
    }
  };

  const renderPinDots = () => {
    return (
      <View className="flex-row justify-center mb-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full mx-2 ${
              i < pin.length ? "bg-purple-500" : "bg-gray-700"
            }`}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];
    
    return (
      <View className="w-full max-w-xs">
        {[0, 1, 2, 3].map((row) => (
          <View key={row} className="flex-row justify-around mb-4">
            {numbers.slice(row * 3, row * 3 + 3).map((num, index) => {
              if (num === "") {
                return <View key={index} className="w-20 h-20" />;
              }
              
              if (num === "delete") {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={handleDelete}
                    className="w-20 h-20 bg-gray-700 rounded-full items-center justify-center active:bg-red-700"
                  >
                    <Delete color="#fff" size={28} />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNumberPress(num)}
                  className="w-20 h-20 bg-gray-700 rounded-full items-center justify-center active:bg-purple-600"
                >
                  <Text className="text-white text-2xl font-bold">{num}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Animated.View 
        className="flex-1 items-center justify-center px-6"
        style={{ 
          opacity: fadeAnim,
          transform: [{ translateX: shakeAnim }] 
        }}
      >
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-purple-600 rounded-full items-center justify-center mb-4">
            <Shield color="#fff" size={40} />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">🔒 Bóveda Segura</Text>
          <Text className="text-gray-400 text-center">
            {hasPin ? "Ingresa tu PIN de 6 dígitos" : "Crea un PIN de 6 dígitos"}
          </Text>
        </View>

        {renderPinDots()}

        {error && (
          <Text className={`mb-6 text-center font-bold ${
            error.includes("✅") ? "text-green-500" : "text-red-500"
          }`}>
            {error}
          </Text>
        )}

        {renderKeypad()}

        <Text className="text-gray-500 text-xs text-center mt-8">
          {hasPin 
            ? "Tu información está protegida" 
            : "Este PIN protegerá tus tareas privadas"}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}