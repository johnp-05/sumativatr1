import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === '' || apiKey === 'tu_api_key_aqui') {
    throw new Error(
      'GEMINI NO CONFIGURADO\n\n' +
      'Pasos:\n' +
      '1. Crea .env en la raíz del proyecto\n' +
      '2. Añade: EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...\n' +
      '3. Obtén key: https://aistudio.google.com/app/apikey\n' +
      '4. Reinicia: npm start'
    );
  }
  
  return new GoogleGenerativeAI(apiKey);
};

function sanitizeInput(input: string): string {
  return input.replace(/[<>{}[\]\\]/g, '').trim().slice(0, 500);
}

// Tipo para las funciones de gestión de tareas
export interface TaskManagementFunctions {
  getNormalTasks: () => Promise<any[]>;
  getVaultTasks: () => Promise<any[]>;
  createTask: (title: string, description: string, isVault: boolean) => Promise<any>;
  updateTask: (id: string | number, updates: any, isVault: boolean) => Promise<any>;
  deleteTask: (id: string | number, isVault: boolean) => Promise<void>;
  moveToVault: (id: number, task: any) => Promise<void>;
  isVaultUnlocked: () => boolean;
}

// Contexto de conversación para mantener el estado
interface ConversationContext {
  lastMentionedTaskId?: string | number;
  lastMentionedTaskType?: 'normal' | 'vault';
  lastAction?: string;
}

export const geminiService = {
  conversationContext: {} as ConversationContext,

  async chatWithTaskManagement(
    prompt: string,
    taskFunctions: TaskManagementFunctions
  ): Promise<string> {
    console.log('💬 === CHAT CON GESTIÓN DE TAREAS ===');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      // Detectar comando especial "concedido"
      const lowerPrompt = prompt.toLowerCase().trim();
      if (lowerPrompt === 'concedido' || lowerPrompt.includes('concedido')) {
        return await this.handleGrantedCommand(taskFunctions);
      }

      // Detectar intención del usuario
      const intention = await this.detectIntention(prompt);
      console.log('🎯 Intención detectada:', intention);

      // Procesar según la intención
      switch (intention.type) {
        case 'list_tasks':
          return await this.handleListTasks(taskFunctions, intention.includeVault);
        
        case 'create_task':
          return await this.handleCreateTask(
            taskFunctions, 
            intention.title!, 
            intention.description, 
            intention.isVault
          );
        
        case 'update_task':
          return await this.handleUpdateTask(
            taskFunctions,
            intention.taskId!,
            intention.updates!,
            intention.isVault
          );
        
        case 'delete_task':
          return await this.handleDeleteTask(
            taskFunctions,
            intention.taskId!,
            intention.taskTitle,
            intention.isVault
          );
        
        case 'move_to_vault':
          return await this.handleMoveToVault(
            taskFunctions,
            intention.taskId!
          );
        
        default:
          // Si no es una acción específica, chat normal con contexto
          return await this.handleGeneralChat(model, prompt, taskFunctions);
      }
    } catch (error) {
      console.error('❌ Error en chat:', error);
      throw error;
    }
  },

  async detectIntention(prompt: string): Promise<any> {
    const lower = prompt.toLowerCase();
    
    // Listar tareas
    if (lower.includes('muestra') || lower.includes('lista') || lower.includes('ver') && 
        (lower.includes('tarea') || lower.includes('pendiente'))) {
      return {
        type: 'list_tasks',
        includeVault: lower.includes('bóveda') || lower.includes('boveda') || lower.includes('privada')
      };
    }

    // Crear tarea
    if (lower.includes('crea') || lower.includes('agrega') || lower.includes('añade') || lower.includes('nueva tarea')) {
      const isVault = lower.includes('bóveda') || lower.includes('boveda') || lower.includes('privada');
      
      // Extraer título y descripción con regex mejorado
      const titleMatch = prompt.match(/(?:tarea|llamada?|titulada?|título)\s*[:"']?\s*([^,.\n]+)/i);
      const descMatch = prompt.match(/(?:descripción|desc|detalles?|con)\s*[:"']?\s*([^.\n]+)/i);
      
      return {
        type: 'create_task',
        title: titleMatch ? titleMatch[1].trim() : null,
        description: descMatch ? descMatch[1].trim() : '',
        isVault
      };
    }

    // Actualizar tarea
    if (lower.includes('actualiza') || lower.includes('edita') || lower.includes('modifica') || lower.includes('cambia')) {
      const idMatch = prompt.match(/tarea\s*#?(\d+)/i);
      
      return {
        type: 'update_task',
        taskId: idMatch ? parseInt(idMatch[1]) : this.conversationContext.lastMentionedTaskId,
        updates: this.extractUpdates(prompt),
        isVault: lower.includes('bóveda') || lower.includes('boveda')
      };
    }

    // Eliminar tarea
    if (lower.includes('elimina') || lower.includes('borra') || lower.includes('quita')) {
      const idMatch = prompt.match(/tarea\s*#?(\d+)/i);
      
      return {
        type: 'delete_task',
        taskId: idMatch ? parseInt(idMatch[1]) : this.conversationContext.lastMentionedTaskId,
        isVault: lower.includes('bóveda') || lower.includes('boveda')
      };
    }

    // Mover a bóveda
    if (lower.includes('mueve') && (lower.includes('bóveda') || lower.includes('boveda'))) {
      const idMatch = prompt.match(/tarea\s*#?(\d+)/i);
      
      return {
        type: 'move_to_vault',
        taskId: idMatch ? parseInt(idMatch[1]) : this.conversationContext.lastMentionedTaskId
      };
    }

    return { type: 'general_chat' };
  },

  extractUpdates(prompt: string): any {
    const updates: any = {};
    const lower = prompt.toLowerCase();
    
    // Extraer nuevo título
    const titleMatch = prompt.match(/título\s*[:"']?\s*([^,.\n]+)/i);
    if (titleMatch) {
      updates.title = titleMatch[1].trim();
    }
    
    // Extraer nueva descripción
    const descMatch = prompt.match(/descripción\s*[:"']?\s*([^.\n]+)/i);
    if (descMatch) {
      updates.description = descMatch[1].trim();
    }
    
    // Detectar cambio de estado
    if (lower.includes('completada') || lower.includes('terminada')) {
      updates.completed = true;
    } else if (lower.includes('pendiente') || lower.includes('incompleta')) {
      updates.completed = false;
    }
    
    return updates;
  },

  async handleGrantedCommand(taskFunctions: TaskManagementFunctions): Promise<string> {
    console.log('🔓 Comando CONCEDIDO detectado');
    
    if (!this.conversationContext.lastMentionedTaskId) {
      return '❌ No hay ninguna tarea reciente para mover a la bóveda. Por favor, menciona primero una tarea específica.';
    }

    if (!taskFunctions.isVaultUnlocked()) {
      return '🔒 La bóveda está bloqueada. Debes desbloquearla primero para mover tareas.';
    }

    try {
      const taskId = this.conversationContext.lastMentionedTaskId as number;
      const normalTasks = await taskFunctions.getNormalTasks();
      const task = normalTasks.find(t => t.id === taskId);
      
      if (!task) {
        return `❌ No se encontró la tarea #${taskId}`;
      }

      await taskFunctions.moveToVault(taskId, task);
      
      this.conversationContext.lastAction = 'moved_to_vault';
      
      return `✅ **Tarea movida a la bóveda**\n\n` +
             `🔒 La tarea "${task.title}" ahora está protegida en tu bóveda segura.\n\n` +
             `Esta tarea ya no aparecerá en tu lista normal de tareas.`;
    } catch (error) {
      console.error('❌ Error al mover a bóveda:', error);
      return `❌ Error al mover la tarea a la bóveda: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleListTasks(
    taskFunctions: TaskManagementFunctions,
    includeVault: boolean
  ): Promise<string> {
    try {
      const normalTasks = await taskFunctions.getNormalTasks();
      let response = '📋 **Tus tareas:**\n\n';
      
      if (normalTasks.length === 0) {
        response += '✨ No tienes tareas pendientes.\n\n';
      } else {
        normalTasks.forEach((task, index) => {
          const status = task.completed ? '✅' : '⭕';
          response += `${status} **#${task.id}** - ${task.title}\n`;
          if (task.description) {
            response += `   📝 ${task.description}\n`;
          }
          response += '\n';
          
          // Guardar la última tarea mencionada
          if (index === 0) {
            this.conversationContext.lastMentionedTaskId = task.id;
            this.conversationContext.lastMentionedTaskType = 'normal';
          }
        });
      }

      if (includeVault) {
        if (!taskFunctions.isVaultUnlocked()) {
          response += '🔒 La bóveda está bloqueada. Desbloquéala para ver tus tareas privadas.';
        } else {
          const vaultTasks = await taskFunctions.getVaultTasks();
          response += '\n🔐 **Tareas en la bóveda:**\n\n';
          
          if (vaultTasks.length === 0) {
            response += '✨ No hay tareas en la bóveda.\n';
          } else {
            vaultTasks.forEach(task => {
              const status = task.completed ? '✅' : '⭕';
              response += `${status} **${task.id}** - ${task.title}\n`;
              if (task.description) {
                response += `   📝 ${task.description}\n`;
              }
              response += '\n';
            });
          }
        }
      }

      return response;
    } catch (error) {
      return `❌ Error al obtener las tareas: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleCreateTask(
    taskFunctions: TaskManagementFunctions,
    title: string | null,
    description: string | undefined,
    isVault: boolean
  ): Promise<string> {
    if (!title) {
      return '❌ Por favor, especifica un título para la tarea.\n\nEjemplo: "Crea una tarea llamada Comprar leche"';
    }

    if (isVault && !taskFunctions.isVaultUnlocked()) {
      return '🔒 La bóveda está bloqueada. Desbloquéala primero para crear tareas privadas.';
    }

    try {
      const newTask = await taskFunctions.createTask(title, description || '', isVault);
      
      this.conversationContext.lastMentionedTaskId = newTask.id;
      this.conversationContext.lastMentionedTaskType = isVault ? 'vault' : 'normal';
      this.conversationContext.lastAction = 'created';
      
      const location = isVault ? '🔐 en tu bóveda segura' : '📋 en tu lista';
      
      return `✅ **Tarea creada exitosamente** ${location}\n\n` +
             `📌 **${newTask.title}**\n` +
             (newTask.description ? `📝 ${newTask.description}\n\n` : '\n') +
             `ID: #${newTask.id}`;
    } catch (error) {
      return `❌ Error al crear la tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleUpdateTask(
    taskFunctions: TaskManagementFunctions,
    taskId: string | number | undefined,
    updates: any,
    isVault: boolean
  ): Promise<string> {
    if (!taskId) {
      return '❌ Por favor, especifica el ID de la tarea que quieres actualizar.\n\nEjemplo: "Actualiza la tarea #3"';
    }

    if (Object.keys(updates).length === 0) {
      return '❌ Por favor, especifica qué quieres cambiar.\n\nEjemplo: "Cambia el título a Nuevo título"';
    }

    try {
      const updated = await taskFunctions.updateTask(taskId, updates, isVault);
      
      let response = '✅ **Tarea actualizada exitosamente**\n\n';
      
      if (updates.title) response += `📝 Nuevo título: ${updates.title}\n`;
      if (updates.description) response += `📄 Nueva descripción: ${updates.description}\n`;
      if (updates.completed !== undefined) {
        response += updates.completed ? '✅ Marcada como completada\n' : '⭕ Marcada como pendiente\n';
      }
      
      return response;
    } catch (error) {
      return `❌ Error al actualizar la tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleDeleteTask(
    taskFunctions: TaskManagementFunctions,
    taskId: string | number | undefined,
    taskTitle: string | undefined,
    isVault: boolean
  ): Promise<string> {
    if (!taskId) {
      return '❌ Por favor, especifica el ID de la tarea que quieres eliminar.\n\nEjemplo: "Elimina la tarea #3"';
    }

    // Pedir confirmación
    return `⚠️ **Confirmación requerida**\n\n` +
           `¿Estás seguro de que quieres eliminar ${taskTitle ? `la tarea "${taskTitle}"` : `la tarea #${taskId}`}?\n\n` +
           `Responde "sí confirmo" para eliminar la tarea.`;
  },

  async confirmDeleteTask(
    taskFunctions: TaskManagementFunctions,
    taskId: string | number,
    isVault: boolean
  ): Promise<string> {
    try {
      await taskFunctions.deleteTask(taskId, isVault);
      
      this.conversationContext.lastMentionedTaskId = undefined;
      this.conversationContext.lastAction = 'deleted';
      
      return `✅ **Tarea eliminada exitosamente**\n\nLa tarea #${taskId} ha sido eliminada ${isVault ? 'de tu bóveda' : 'de tu lista'}.`;
    } catch (error) {
      return `❌ Error al eliminar la tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleMoveToVault(
    taskFunctions: TaskManagementFunctions,
    taskId: number | undefined
  ): Promise<string> {
    if (!taskId) {
      return '❌ Por favor, especifica el ID de la tarea que quieres mover.\n\nEjemplo: "Mueve la tarea #3 a la bóveda"';
    }

    if (!taskFunctions.isVaultUnlocked()) {
      return '🔒 La bóveda está bloqueada. Desbloquéala primero para mover tareas.';
    }

    try {
      const normalTasks = await taskFunctions.getNormalTasks();
      const task = normalTasks.find(t => t.id === taskId);
      
      if (!task) {
        return `❌ No se encontró la tarea #${taskId} en tu lista normal.`;
      }

      await taskFunctions.moveToVault(taskId, task);
      
      return `✅ **Tarea movida a la bóveda**\n\n` +
             `🔒 La tarea "${task.title}" ahora está protegida en tu bóveda segura.`;
    } catch (error) {
      return `❌ Error al mover la tarea: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  },

  async handleGeneralChat(
    model: any,
    prompt: string,
    taskFunctions: TaskManagementFunctions
  ): Promise<string> {
    // Si menciona confirmación de eliminación
    const lower = prompt.toLowerCase();
    if ((lower.includes('sí') || lower.includes('si')) && lower.includes('confirmo') && 
        this.conversationContext.lastMentionedTaskId) {
      return await this.confirmDeleteTask(
        taskFunctions,
        this.conversationContext.lastMentionedTaskId,
        this.conversationContext.lastMentionedTaskType === 'vault'
      );
    }

    // Chat normal con contexto
    const sanitizedPrompt = sanitizeInput(prompt);
    const contextPrompt = `Eres un asistente de productividad especializado en gestión de tareas. 
Puedes ayudar a crear, editar, eliminar y organizar tareas.

${sanitizedPrompt}`;

    const result = await model.generateContent(contextPrompt);
    return result.response.text();
  },

  // Método simplificado para sugerencias (sin cambios)
  async suggestTaskDescription(title: string): Promise<string> {
    const sanitizedTitle = sanitizeInput(title);
    const prompt = `Genera una descripción breve (máximo 50 palabras) para esta tarea: "${sanitizedTitle}". Responde SOLO con la descripción.`;
    
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });
      
      const result = await model.generateContent(prompt);
      return result.response.text().replace(/["']/g, '').trim();
    } catch (error) {
      console.error('❌ Error en sugerencia:', error);
      throw error;
    }
  },
};