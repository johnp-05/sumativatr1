import { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { validateTaskTitle, validateTaskDescription } from '@/utils/validation';
import { taskService } from '@/services/task-service';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = parseInt(id, 10);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { updateTask } = useTasks();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await taskService.getTask(taskId);
        setTitle(task.title);
        setDescription(task.description);
        setCompleted(task.completed);
      } catch {
        setTitleError('Error al cargar la tarea');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

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
      await updateTask(taskId, {
        title: title.trim(),
        description: description.trim(),
        completed,
      });
      router.back();
    } catch (error) {
      setTitleError(error instanceof Error ? error.message : 'Error al actualizar la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

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
            <ThemedText style={styles.label}>Descripción</ThemedText>
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
            style={styles.checkboxContainer}
            onPress={() => setCompleted(!completed)}>
            <ThemedView
              style={[
                styles.checkbox,
                completed && { backgroundColor: tintColor, borderColor: tintColor },
              ]}>
              {completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
            </ThemedView>
            <ThemedText style={styles.checkboxLabel}>Marcar como completada</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: tintColor }]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitText}>Guardar Cambios</ThemedText>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    // gap removed for web compatibility,
  },
  inputGroup: {
    // gap removed for web compatibility,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap removed for web compatibility,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
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
