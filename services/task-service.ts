export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// IMPORTANTE: Cambia esta URL si tu servidor está en otro puerto
const API_BASE_URL = 'http://localhost:3001';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    console.log('📥 Obteniendo tareas desde:', API_BASE_URL);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      console.log('✅ Respuesta getTasks:', response.status);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('📋 Tareas obtenidas:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error en getTasks:', error);
      throw new Error('No se pudo conectar al servidor. Verifica que json-server esté corriendo en puerto 3001');
    }
  },

  async getTask(id: number): Promise<Task> {
    console.log('📥 Obteniendo tarea ID:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error en getTask:', error);
      throw error;
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    console.log('📤 Creando tarea:', task.title);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          createdAt: new Date().toISOString(),
        }),
      });
      console.log('✅ Respuesta createTask:', response.status);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const newTask = await response.json();
      console.log('✅ Tarea creada con ID:', newTask.id);
      return newTask;
    } catch (error) {
      console.error('❌ Error en createTask:', error);
      throw new Error('No se pudo crear la tarea');
    }
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    console.log('📤 Actualizando tarea ID:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      console.log('✅ Respuesta updateTask:', response.status);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const updated = await response.json();
      console.log('✅ Tarea actualizada:', updated.id);
      return updated;
    } catch (error) {
      console.error('❌ Error en updateTask:', error);
      throw new Error('No se pudo actualizar la tarea');
    }
  },

  async deleteTask(id: number): Promise<void> {
    console.log('🗑️ ELIMINANDO tarea ID:', id);
    console.log('🔗 URL completa:', `${API_BASE_URL}/tasks/${id}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        console.error('❌ Error HTTP:', response.status, response.statusText);
        throw new Error(`Error al eliminar: ${response.status}`);
      }
      
      console.log('✅ Tarea eliminada exitosamente del servidor');
    } catch (error) {
      console.error('❌ ERROR COMPLETO en deleteTask:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('No se pudo conectar al servidor. Verifica que json-server esté corriendo.');
      }
      throw error;
    }
  },
};