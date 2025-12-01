import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface VaultTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface VaultContextType {
  isUnlocked: boolean;
  pin: string | null;
  vaultTasks: VaultTask[];
  unlock: (enteredPin: string) => Promise<boolean>;
  lock: () => void;
  setPin: (newPin: string) => Promise<void>;
  hasPin: boolean;
  addVaultTask: (task: Omit<VaultTask, 'id' | 'createdAt'>) => Promise<void>;
  updateVaultTask: (id: string, task: Partial<VaultTask>) => Promise<void>;
  deleteVaultTask: (id: string) => Promise<void>;
  toggleVaultTaskComplete: (id: string) => Promise<void>;
  loading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const VAULT_PIN_KEY = 'vault_pin';
const VAULT_TASKS_KEY = 'vault_tasks';

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setStoredPin] = useState<string | null>(null);
  const [vaultTasks, setVaultTasks] = useState<VaultTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar PIN y tareas al iniciar
  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      console.log('🔐 Cargando datos de la bóveda...');
      
      // Cargar PIN
      const storedPin = await SecureStore.getItemAsync(VAULT_PIN_KEY);
      if (storedPin) {
        setStoredPin(storedPin);
        console.log('✅ PIN cargado');
      } else {
        console.log('ℹ️ No hay PIN configurado');
      }
      
      // Cargar tareas
      const storedTasks = await SecureStore.getItemAsync(VAULT_TASKS_KEY);
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        setVaultTasks(tasks);
        console.log('✅ Tareas de bóveda cargadas:', tasks.length);
      } else {
        console.log('ℹ️ No hay tareas en la bóveda');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos de la bóveda:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (tasks: VaultTask[]) => {
    try {
      await SecureStore.setItemAsync(VAULT_TASKS_KEY, JSON.stringify(tasks));
      console.log('✅ Tareas guardadas en bóveda:', tasks.length);
    } catch (error) {
      console.error('❌ Error al guardar tareas:', error);
      throw new Error('No se pudieron guardar las tareas');
    }
  };

  const unlock = useCallback(async (enteredPin: string): Promise<boolean> => {
    console.log('🔓 Intentando desbloquear bóveda...');
    
    if (pin === null) {
      // Primera vez: configurar PIN
      console.log('🆕 Configurando nuevo PIN');
      try {
        await SecureStore.setItemAsync(VAULT_PIN_KEY, enteredPin);
        setStoredPin(enteredPin);
        setIsUnlocked(true);
        console.log('✅ PIN configurado y bóveda desbloqueada');
        return true;
      } catch (error) {
        console.error('❌ Error al guardar PIN:', error);
        return false;
      }
    }
    
    // Verificar PIN
    if (enteredPin === pin) {
      setIsUnlocked(true);
      console.log('✅ Bóveda desbloqueada');
      return true;
    }
    
    console.log('❌ PIN incorrecto');
    return false;
  }, [pin]);

  const lock = useCallback(() => {
    console.log('🔒 Bloqueando bóveda');
    setIsUnlocked(false);
  }, []);

  const setPin = useCallback(async (newPin: string) => {
    try {
      await SecureStore.setItemAsync(VAULT_PIN_KEY, newPin);
      setStoredPin(newPin);
      console.log('✅ PIN actualizado');
    } catch (error) {
      console.error('❌ Error al actualizar PIN:', error);
      throw new Error('No se pudo actualizar el PIN');
    }
  }, []);

  const addVaultTask = useCallback(async (task: Omit<VaultTask, 'id' | 'createdAt'>) => {
    console.log('➕ Agregando tarea a la bóveda:', task.title);
    
    const newTask: VaultTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...vaultTasks, newTask];
    setVaultTasks(updatedTasks);
    await saveTasks(updatedTasks);
    
    console.log('✅ Tarea agregada a la bóveda');
  }, [vaultTasks]);

  const updateVaultTask = useCallback(async (id: string, taskData: Partial<VaultTask>) => {
    console.log('📝 Actualizando tarea de la bóveda:', id);
    
    const updatedTasks = vaultTasks.map((task) =>
      task.id === id ? { ...task, ...taskData } : task
    );
    
    setVaultTasks(updatedTasks);
    await saveTasks(updatedTasks);
    
    console.log('✅ Tarea actualizada');
  }, [vaultTasks]);

  const deleteVaultTask = useCallback(async (id: string) => {
    console.log('🗑️ Eliminando tarea de la bóveda:', id);
    
    const updatedTasks = vaultTasks.filter((task) => task.id !== id);
    setVaultTasks(updatedTasks);
    await saveTasks(updatedTasks);
    
    console.log('✅ Tarea eliminada de la bóveda');
  }, [vaultTasks]);

  const toggleVaultTaskComplete = useCallback(async (id: string) => {
    console.log('✓ Cambiando estado de tarea:', id);
    
    const updatedTasks = vaultTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    setVaultTasks(updatedTasks);
    await saveTasks(updatedTasks);
    
    console.log('✅ Estado actualizado');
  }, [vaultTasks]);

  const value: VaultContextType = {
    isUnlocked,
    pin,
    vaultTasks,
    unlock,
    lock,
    setPin,
    hasPin: pin !== null,
    addVaultTask,
    updateVaultTask,
    deleteVaultTask,
    toggleVaultTaskComplete,
    loading,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}