import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { validateTaskTitle, validateTaskDescription } from '@/utils/validation';
import { geminiService } from '@/services/gemini-service';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const { addTask } = useTasks();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (titleError) {
      const validation = validateTaskTitle(text);
      if (validation.isValid) {
        setTitleError('');
      }
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (descriptionError) {
      const validation = validateTaskDescription(text);
      if (validation.isValid) {
        setDescriptionError('');
      }
    }
  };

  const handleSuggestDescription = async () => {
    if (!title.trim()) {
      setTitleError('Ingresa un título primero para generar una sugerencia');
      return;
    }

    setIsSuggesting(true);
    try {
      const suggestion = await geminiService.suggestTaskDescription(title);
      setDescription(suggestion);
      setDescriptionError('');
    } catch (error) {
      setDescriptionError(
        error instanceof Error ? error.message : 'Error al generar sugerencia'
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async () => {
    const titleValidation = validateTaskTitle(title);
    const descriptionValidation = validateTaskDescription(description);

    if (!titleValidation.isValid) {
      setTitleError(titleValidation.error || 'Error de validación');
      return;
    }

    if (!descriptionValidation.isValid) {
      setDescriptionError(descriptionValidation.error || 'Error de validación');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });
      router.back();
    } catch (error) {
      setTitleError(error instanceof Error ? error.message : 'Error al crear la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Título *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: titleError ? '#e53935' : '#ccc' },
              ]}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Ingresa el título de la tarea"
              placeholderTextColor="#999"
              maxLength={100}
            />
            {titleError ? <ThemedText style={styles.errorText}>{titleError}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedView style={styles.labelRow}>
              <ThemedText style={styles.label}>Descripción</ThemedText>
              <TouchableOpacity
                style={[styles.suggestButton, { borderColor: tintColor }]}
                onPress={handleSuggestDescription}
                disabled={isSuggesting}>
                {isSuggesting ? (
                  <ActivityIndicator size="small" color={tintColor} />
                ) : (
                  <ThemedText style={[styles.suggestText, { color: tintColor }]}>
                    ✨ Sugerir con IA
                  </ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { color: textColor, borderColor: descriptionError ? '#e53935' : '#ccc' },
              ]}
              value={description}
              onChangeText={handleDescriptionChange}
              placeholder="Ingresa una descripción (opcional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            {descriptionError ? (
              <ThemedText style={styles.errorText}>{descriptionError}</ThemedText>
            ) : null}
          </ThemedView>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: tintColor }]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitText}>Crear Tarea</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  suggestText: {
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
