import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Task, taskService } from '@/services/task-service';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: number, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskComplete: (id: number) => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, taskData: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTaskComplete = useCallback(
    async (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await updateTask(id, { completed: !task.completed });
      }
    },
    [tasks, updateTask]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
