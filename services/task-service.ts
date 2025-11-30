export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002';

console.log('🌐 API Base URL:', API_BASE_URL);

export const taskService = {
  async getTasks(): Promise<Task[]> {
    console.log('📥 Obteniendo todas las tareas...');
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      console.log('Status getTasks:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error al obtener tareas`);
      }
      
      const tasks = await response.json();
      console.log(`✅ ${tasks.length} tareas obtenidas`);
      return tasks;
    } catch (error) {
      console.error('❌ Error en getTasks:', error);
      throw new Error('Error al obtener las tareas. Verifica que json-server esté corriendo en el puerto 3002');
    }
  },

  async getTask(id: number): Promise<Task> {
    console.log('📥 Obteniendo tarea:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      console.log('Status getTask:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error al obtener la tarea`);
      }
      
      const task = await response.json();
      console.log('✅ Tarea obtenida:', task.title);
      return task;
    } catch (error) {
      console.error('❌ Error en getTask:', error);
      throw new Error('Error al obtener la tarea');
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    console.log('➕ Creando tarea:', task.title);
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
      
      console.log('Status createTask:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const newTask = await response.json();
      console.log('✅ Tarea creada con ID:', newTask.id);
      return newTask;
    } catch (error) {
      console.error('❌ Error en createTask:', error);
      throw new Error('Error al crear la tarea');
    }
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    console.log('📝 Actualizando tarea:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      console.log('Status updateTask:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const updatedTask = await response.json();
      console.log('✅ Tarea actualizada:', updatedTask.title);
      return updatedTask;
    } catch (error) {
      console.error('❌ Error en updateTask:', error);
      throw new Error('Error al actualizar la tarea');
    }
  },

  async deleteTask(id: number): Promise<void> {
    console.log('🗑️ ELIMINANDO TAREA ID:', id);
    console.log('URL completa:', `${API_BASE_URL}/tasks/${id}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status deleteTask:', response.status);
      console.log('Response OK?:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: No se pudo eliminar la tarea`);
      }
      
      console.log('✅ TAREA ELIMINADA EXITOSAMENTE');
    } catch (error) {
      console.error('❌ ERROR CRÍTICO EN deleteTask:', error);
      if (error instanceof Error) {
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
      }
      throw new Error('Error al eliminar la tarea. Verifica que json-server esté corriendo.');
    }
  },
};