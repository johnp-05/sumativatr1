import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Gestión de Tareas</ThemedText>
        <ThemedText>
          Esta aplicación te permite gestionar tus tareas de manera eficiente. Utiliza JSON Server
          como backend y Gemini AI para sugerencias inteligentes.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/(tabs)/tasks" asChild>
          <TouchableOpacity style={[styles.featureCard, { borderColor: tintColor }]}>
            <ThemedText type="subtitle">📋 Mis Tareas</ThemedText>
            <ThemedText>
              Crea, edita y elimina tareas. Marca las completadas y mantén tu lista organizada.
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/gemini" asChild>
          <TouchableOpacity style={[styles.featureCard, { borderColor: tintColor }]}>
            <ThemedText type="subtitle">✨ Gemini AI</ThemedText>
            <ThemedText>
              Chatea con Gemini AI para obtener sugerencias y ayuda con tus tareas.
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Características</ThemedText>
        <ThemedText>• Validación de formularios alfanuméricos</ThemedText>
        <ThemedText>• Integración con JSON Server (CRUD)</ThemedText>
        <ThemedText>• Estado global con Context API</ThemedText>
        <ThemedText>• Navegación con Expo Router</ThemedText>
        <ThemedText>• Sugerencias con Gemini AI</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 16,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
