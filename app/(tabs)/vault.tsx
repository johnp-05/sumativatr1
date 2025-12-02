import { View, Text, TouchableOpacity, Animated, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVault } from "@/context/vault-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Delete, Shield, RotateCcw } from "lucide-react-native";

export default function VaultAccessScreen() {
  const { unlock, hasPin, isUnlocked, resetPin } = useVault();
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
    console.log('🔍 Estado de bóveda actualizado:', { isUnlocked, hasPin });
    if (isUnlocked) {
      console.log('✅ Redirigiendo a /vault/tasks...');
      setTimeout(() => {
        router.replace("/vault/tasks");
      }, 800);
    }
  }, [isUnlocked, router]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNumberPress = async (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");

      if (newPin.length === 6) {
        console.log('🔐 PIN de 6 dígitos ingresado:', newPin);
        
        setTimeout(async () => {
          console.log('🔓 Llamando a unlock...');
          const success = await unlock(newPin);
          
          console.log('📊 Resultado de unlock:', success);
          
          if (!success) {
            console.log('❌ Unlock retornó false');
            setError("❌ PIN incorrecto");
            shake();
            setPin("");
          } else {
            console.log('✅ Unlock retornó true');
            setError("✅ Acceso concedido");
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError("");
    }
  };

  const handleResetPin = () => {
    Alert.alert(
      "⚠️ Resetear Bóveda",
      "Esto eliminará tu PIN actual.\n\n¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, resetear",
          style: "destructive",
          onPress: async () => {
            try {
              await resetPin();
              setPin("");
              setError("");
              Alert.alert("✅ Listo", "PIN eliminado. Ahora puedes crear uno nuevo.");
            } catch (error) {
              Alert.alert("❌ Error", "No se pudo resetear el PIN");
            }
          },
        },
      ]
    );
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
                  disabled={pin.length === 6 && error.includes("✅")}
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
          <Text className={`mb-6 text-center font-bold text-lg ${
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
        
        {/* Botón de reset */}
        {hasPin && (
          <TouchableOpacity
            onPress={handleResetPin}
            className="mt-6 bg-red-900/30 border border-red-700 px-6 py-3 rounded-lg flex-row items-center"
          >
            <RotateCcw color="#ef4444" size={18} />
            <Text className="text-red-400 ml-2 font-semibold">¿Olvidaste tu PIN?</Text>
          </TouchableOpacity>
        )}

        {/* Debug info */}
        {__DEV__ && (
          <TouchableOpacity
            onPress={() => {
              console.log('🐛 === DEBUG INFO ===');
              console.log('hasPin:', hasPin);
              console.log('isUnlocked:', isUnlocked);
              console.log('PIN length:', pin.length);
              console.log('Error:', error);
              Alert.alert(
                "Debug Info",
                `hasPin: ${hasPin}\nisUnlocked: ${isUnlocked}\nPIN: ${pin.length} dígitos`
              );
            }}
            className="mt-4 bg-gray-800 px-4 py-2 rounded"
          >
            <Text className="text-gray-400 text-xs">🐛 Ver Debug Info</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}