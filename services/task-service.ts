export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// Detectar la IP automáticamente según la plataforma
// Para desarrollo local, usa tu IP de red local
// Ejemplo: Si tu computadora está en 192.168.1.100, usa esa IP
const getApiUrl = () => {
  // En producción o web, usa la URL completa
  // En desarrollo, puedes cambiar esto por tu IP local
  // Ejemplo: return 'http://192.168.1.100:3001';
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiUrl();

// Helper para verificar si el servidor está disponible
async function checkServerConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    console.log('📥 [GET] Obteniendo tareas desde:', API_BASE_URL);
    
    try {
      const isConnected = await checkServerConnection();
      
      if (!isConnected) {
        throw new Error(
          '🚫 NO SE PUEDE CONECTAR AL SERVIDOR\n\n' +
          '¿El servidor está corriendo?\n\n' +
          '1. Abre una terminal\n' +
          '2. Ejecuta: npm run server\n' +
          '3. Debe decir: "JSON Server is running on port 3001"\n\n' +
          'Si usas dispositivo físico:\n' +
          '1. Cambia localhost por tu IP local en task-service.ts\n' +
          '2. Ejemplo: http://192.168.1.100:3001'
        );
      }

      const response = await fetch(`${API_BASE_URL}/tasks`);
      console.log('✅ Respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Tareas obtenidas:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error en getTasks:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
          throw new Error(
            '🚫 ERROR DE RED\n\n' +
            'No se puede conectar al servidor.\n\n' +
            'Verifica:\n' +
            '1. Que json-server esté corriendo (npm run server)\n' +
            '2. Que el puerto 3001 esté libre\n' +
            '3. Tu firewall no bloquee la conexión'
          );
        }
        throw error;
      }
      
      throw new Error('Error desconocido al obtener tareas');
    }
  },

  async getTask(id: number): Promise<Task> {
    console.log('📥 [GET] Obteniendo tarea ID:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tarea no encontrada');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const task = await response.json();
      console.log('✅ Tarea obtenida:', task.title);
      return task;
    } catch (error) {
      console.error('❌ Error en getTask:', error);
      throw error;
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    console.log('📤 [POST] Creando tarea:', task.title);
    
    try {
      const taskData = {
        ...task,
        createdAt: new Date().toISOString(),
      };
      
      console.log('📦 Datos a enviar:', taskData);
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      console.log('📡 Respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`No se pudo crear la tarea: ${response.status}`);
      }
      
      const newTask = await response.json();
      console.log('✅ Tarea creada con ID:', newTask.id);
      return newTask;
    } catch (error) {
      console.error('❌ Error en createTask:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
          throw new Error('No se puede conectar al servidor. Verifica que json-server esté corriendo.');
        }
        throw error;
      }
      
      throw new Error('Error al crear la tarea');
    }
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    console.log('📤 [PATCH] Actualizando tarea ID:', id);
    console.log('📦 Cambios:', task);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      console.log('📡 Respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`No se pudo actualizar: ${response.status}`);
      }
      
      const updated = await response.json();
      console.log('✅ Tarea actualizada:', updated.title);
      return updated;
    } catch (error) {
      console.error('❌ Error en updateTask:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
          throw new Error('No se puede conectar al servidor');
        }
        throw error;
      }
      
      throw new Error('Error al actualizar la tarea');
    }
  },

  async deleteTask(id: number): Promise<void> {
    console.log('🗑️ [DELETE] Eliminando tarea ID:', id);
    console.log('🔗 URL:', `${API_BASE_URL}/tasks/${id}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Respuesta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`No se pudo eliminar: ${response.status}`);
      }
      
      console.log('✅ Tarea eliminada del servidor');
    } catch (error) {
      console.error('❌ Error en deleteTask:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
          throw new Error('No se puede conectar al servidor');
        }
        throw error;
      }
      
      throw new Error('Error al eliminar la tarea');
    }
  },
};