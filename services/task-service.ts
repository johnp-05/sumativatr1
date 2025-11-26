export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:3001';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }
    return response.json();
  },

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la tarea');
    }
    return response.json();
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
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
    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }
    return response.json();
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }
    return response.json();
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la tarea');
    }
  },
};
