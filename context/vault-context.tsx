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
  resetPin: () => Promise<void>;
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

  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      console.log('🔐 === CARGANDO DATOS DE BÓVEDA ===');
      
      const storedPin = await SecureStore.getItemAsync(VAULT_PIN_KEY);
      console.log('PIN almacenado:', storedPin ? 'SÍ (existe)' : 'NO (null)');
      
      if (storedPin) {
        setStoredPin(storedPin);
        console.log('✅ PIN cargado exitosamente');
      } else {
        setStoredPin(null);
        console.log('ℹ️ No hay PIN configurado - Primera vez');
      }
      
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
      console.log('🏁 Carga de datos completada');
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
    console.log('🔓 === INTENTANDO DESBLOQUEAR BÓVEDA ===');
    console.log('PIN almacenado en estado:', pin);
    console.log('¿Es null?:', pin === null);
    console.log('PIN ingresado:', enteredPin);
    console.log('Longitud PIN ingresado:', enteredPin.length);
    
    // CRÍTICO: Verificar en SecureStore directamente por si el estado no está sincronizado
    const storedPin = await SecureStore.getItemAsync(VAULT_PIN_KEY);
    console.log('PIN en SecureStore:', storedPin ? 'EXISTE' : 'NO EXISTE (null)');
    
    if (storedPin === null || storedPin === undefined) {
      // Primera vez: configurar PIN
      console.log('🆕 === CONFIGURANDO NUEVO PIN (PRIMERA VEZ) ===');
      try {
        await SecureStore.setItemAsync(VAULT_PIN_KEY, enteredPin);
        console.log('✅ PIN guardado en SecureStore:', enteredPin);
        
        setStoredPin(enteredPin);
        console.log('✅ PIN guardado en estado');
        
        setIsUnlocked(true);
        console.log('✅ Bóveda desbloqueada (isUnlocked = true)');
        
        console.log('✅ ¡PIN CONFIGURADO EXITOSAMENTE!');
        return true;
      } catch (error) {
        console.error('❌ Error al guardar PIN:', error);
        return false;
      }
    }
    
    // Verificar PIN existente
    console.log('🔍 === VERIFICANDO PIN EXISTENTE ===');
    console.log('Comparando:', enteredPin, '===', storedPin);
    const isCorrect = enteredPin === storedPin;
    console.log('Resultado de comparación:', isCorrect);
    
    if (isCorrect) {
      setIsUnlocked(true);
      console.log('✅ PIN CORRECTO - Bóveda desbloqueada');
      return true;
    }
    
    console.log('❌ PIN INCORRECTO');
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

  const resetPin = useCallback(async () => {
    console.log('🔄 Reseteando PIN...');
    try {
      await SecureStore.deleteItemAsync(VAULT_PIN_KEY);
      setStoredPin(null);
      setIsUnlocked(false);
      console.log('✅ PIN eliminado - Bóveda reseteada');
    } catch (error) {
      console.error('❌ Error al resetear PIN:', error);
      throw new Error('No se pudo resetear el PIN');
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
    hasPin: pin !== null && pin !== undefined,
    addVaultTask,
    updateVaultTask,
    deleteVaultTask,
    toggleVaultTaskComplete,
    resetPin,
    loading,
  };

  // Log para debug
  useEffect(() => {
    console.log('📊 Estado del contexto:', { 
      isUnlocked, 
      hasPin: pin !== null, 
      pinValue: pin ? '***' + pin.slice(-2) : 'null',
      tasksCount: vaultTasks.length 
    });
  }, [isUnlocked, pin, vaultTasks.length]);

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}