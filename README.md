# Sumativa TR1 - Aplicación de Gestión de Tareas

Una aplicación React Native construida con Expo que permite gestionar tareas con integración de JSON Server y Gemini AI.

## Demostración

![Demo 1](GIF_20251202_164616_339.gif)
![Demo 2](GIF_20251202_165024_866.gif)

## Características

- ✅ **Gestión de Tareas (CRUD)**: Crear, leer, actualizar y eliminar tareas
- ✅ **Validación de Formularios**: Validación alfanumérica para campos de texto
- ✅ **Estado Global**: Implementado con Context API para evitar prop-drilling
- ✅ **Navegación**: Expo Router con rutas basadas en archivos y parámetros dinámicos
- ✅ **Gemini AI**: Chat integrado y sugerencias automáticas de descripción
- ✅ **Modo Oscuro/Claro**: Soporte para temas según preferencias del sistema

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd sumativatr1
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la API key de Gemini AI:
```bash
cp .env.example .env
```
Edita el archivo `.env` y añade tu API key de Gemini:
```
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

Puedes obtener una API key en: https://makersuite.google.com/app/apikey

## Uso

### Ejecutar JSON Server

```bash
npm run server
```

Esto iniciará el servidor en `http://localhost:3001`. Los endpoints disponibles son:

- `GET /tasks` - Obtener todas las tareas
- `GET /tasks/:id` - Obtener una tarea específica
- `POST /tasks` - Crear una nueva tarea
- `PATCH /tasks/:id` - Actualizar una tarea
- `DELETE /tasks/:id` - Eliminar una tarea

### Ejecutar la Aplicación

En una terminal separada:

```bash
npm start
```

O para ejecutar todo simultáneamente (requiere `concurrently`):
```bash
npm install -D concurrently
npm run dev
```

### Opciones de Ejecución

- **Web**: Presiona `w` en la terminal
- **Android**: Presiona `a` (requiere emulador o dispositivo conectado)
- **iOS**: Presiona `i` (requiere Xcode en macOS)

## Estructura del Proyecto

```
sumativatr1/
├── app/                    # Pantallas (Expo Router)
│   ├── (tabs)/            # Pestañas de navegación
│   │   ├── index.tsx      # Pantalla principal
│   │   ├── tasks.tsx      # Lista de tareas
│   │   └── explore.tsx    # Pantalla de exploración
│   ├── task/              # Rutas dinámicas para tareas
│   │   ├── create.tsx     # Crear nueva tarea
│   │   └── [id].tsx       # Editar tarea (parámetro dinámico)
│   ├── gemini.tsx         # Chat con Gemini AI
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
├── context/               # Contextos de React
│   └── task-context.tsx   # Estado global de tareas
├── services/              # Servicios de API
│   ├── task-service.ts    # Operaciones CRUD de tareas
│   └── gemini-service.ts  # Integración con Gemini AI
├── utils/                 # Utilidades
│   └── validation.ts      # Validación de formularios
├── db.json               # Base de datos de JSON Server
└── .env.example          # Ejemplo de variables de entorno
```

## Validación de Formularios

Los formularios de tareas incluyen validación para:

- **Título**: Obligatorio, 3-100 caracteres, solo alfanuméricos y puntuación básica
- **Descripción**: Opcional, máximo 500 caracteres, solo alfanuméricos y puntuación básica

```typescript
// Ejemplo de uso
import { validateTaskTitle, validateTaskDescription } from '@/utils/validation';

const titleValidation = validateTaskTitle('Mi tarea');
if (!titleValidation.isValid) {
  console.log(titleValidation.error);
}
```

## Integración con Gemini AI

### Configuración

1. Obtén una API key en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Añade la key al archivo `.env`:
```
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

### Uso

La aplicación ofrece dos formas de interactuar con Gemini AI:

1. **Chat directo**: Accede desde la pantalla principal al botón "Gemini AI"
2. **Sugerencias**: Al crear una tarea, usa el botón "Sugerir con IA" para generar una descripción automática

```typescript
// Ejemplo de uso del servicio
import { geminiService } from '@/services/gemini-service';

const response = await geminiService.chat('¿Cómo organizo mis tareas?');
const suggestion = await geminiService.suggestTaskDescription('Estudiar React');
```

## Context API

El estado de las tareas se gestiona globalmente con Context API:

```typescript
import { useTasks } from '@/context/task-context';

function MiComponente() {
  const { tasks, addTask, updateTask, deleteTask, loading, error } = useTasks();
  
  // Usar el estado y las funciones...
}
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia Expo |
| `npm run server` | Inicia JSON Server en puerto 3001 |
| `npm run web` | Abre la app en el navegador |
| `npm run android` | Abre en emulador Android |
| `npm run ios` | Abre en simulador iOS |
| `npm run lint` | Ejecuta el linter |

## Tecnologías Utilizadas

- **Expo SDK 54**: Framework de desarrollo
- **Expo Router 6**: Navegación basada en archivos
- **React Native 0.81**: Framework de UI
- **NativeWind**: Estilos con Tailwind CSS
- **JSON Server**: API REST simulada
- **Google Generative AI**: Integración con Gemini AI
- **TypeScript**: Tipado estático

## Notas de Seguridad

- Nunca compartas tu API key de Gemini
- El archivo `.env` está incluido en `.gitignore` para proteger tus credenciales
- En producción, usa variables de entorno del servidor

## Licencia

Proyecto privado para propósitos educativos.
