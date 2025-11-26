import { useState, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  View,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/context/task-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task } from '@/services/task-service';

export default function TasksScreen() {
  const { tasks, loading, error, fetchTasks, toggleTaskComplete, deleteTask } = useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const tintColor = useThemeColor({}, 'tint');

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  const handleDelete = (task: Task) => {
    Alert.alert('Eliminar Tarea', `¿Estás seguro de que deseas eliminar "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteTask(task.id),
      },
    ]);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, { backgroundColor: item.completed ? '#e8f5e9' : '#fff' }]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskComplete(item.id)}
        activeOpacity={0.7}>
        <View style={styles.checkbox}>
          {item.completed && <View style={[styles.checkboxInner, { backgroundColor: tintColor }]} />}
        </View>
        <View style={styles.taskInfo}>
          <ThemedText
            style={[styles.taskTitle, item.completed && styles.completedText]}
            numberOfLines={1}>
            {item.title}
          </ThemedText>
          {item.description ? (
            <ThemedText style={styles.taskDescription} numberOfLines={2}>
              {item.description}
            </ThemedText>
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={styles.taskActions}>
        <Link href={`/task/${item.id}`} asChild>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={[styles.actionText, { color: tintColor }]}>Editar</ThemedText>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <ThemedText style={[styles.actionText, { color: '#e53935' }]}>Eliminar</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: tintColor }]} onPress={fetchTasks}>
          <ThemedText style={styles.retryText}>Reintentar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Mis Tareas</ThemedText>
        <Link href="/task/create" asChild>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.addButtonText}>+ Nueva</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {tasks.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No hay tareas todavía</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Toca el botón &quot;+ Nueva&quot; para crear tu primera tarea
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
