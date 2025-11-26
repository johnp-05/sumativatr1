import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  unlock: (enteredPin: string) => boolean;
  lock: () => void;
  setPin: (newPin: string) => void;
  hasPin: boolean;
  addVaultTask: (task: Omit<VaultTask, 'id' | 'createdAt'>) => void;
  updateVaultTask: (id: string, task: Partial<VaultTask>) => void;
  deleteVaultTask: (id: string) => void;
  toggleVaultTaskComplete: (id: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setStoredPin] = useState<string | null>(null);
  const [vaultTasks, setVaultTasks] = useState<VaultTask[]>([]);

  const unlock = useCallback((enteredPin: string): boolean => {
    if (pin === null) {
      // First time setup
      setStoredPin(enteredPin);
      setIsUnlocked(true);
      return true;
    }
    
    if (enteredPin === pin) {
      setIsUnlocked(true);
      return true;
    }
    
    return false;
  }, [pin]);

  const lock = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  const setPin = useCallback((newPin: string) => {
    setStoredPin(newPin);
  }, []);

  const addVaultTask = useCallback((task: Omit<VaultTask, 'id' | 'createdAt'>) => {
    const newTask: VaultTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setVaultTasks((prev) => [...prev, newTask]);
  }, []);

  const updateVaultTask = useCallback((id: string, taskData: Partial<VaultTask>) => {
    setVaultTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...taskData } : task))
    );
  }, []);

  const deleteVaultTask = useCallback((id: string) => {
    setVaultTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleVaultTaskComplete = useCallback((id: string) => {
    setVaultTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

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