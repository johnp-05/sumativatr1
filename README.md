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

Edita el archivo `.env`:
```
EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

## Uso

### Ejecutar JSON Server
```bash
npm run server
```

### Ejecutar la Aplicación
```bash
npm start
```

O ejecutar todo simultáneamente:
```bash
npm install -D concurrently
npm run dev
```

## Estructura del Proyecto
```
sumativatr1/
├── app/
│   ├── (tabs)/
│   ├── task/
│   ├── gemini.tsx
│   └── _layout.tsx
├── components/
├── context/
├── services/
├── utils/
├── db.json
└── .env.example
```

## Validación de Formularios
```ts
import { validateTaskTitle } from '@/utils/validation';

const result = validateTaskTitle('Mi tarea');
```

## Integración con Gemini AI
```ts
import { geminiService } from '@/services/gemini-service';

const response = await geminiService.chat('Mensaje...');
```

## Context API
```ts
import { useTasks } from '@/context/task-context';
```

## Scripts Disponibles
| Comando | Descripción |
|--------|-------------|
| `npm start` | Inicia Expo |
| `npm run server` | Inicia JSON Server |
| `npm run web` | Navegador |
| `npm run android` | Emulador Android |
| `npm run ios` | Simulador iOS |
| `npm run lint` | Corre el linter |

## Tecnologías
- Expo SDK 54
- Expo Router 6
- React Native 0.81
- NativeWind
- JSON Server
- Gemini AI
- TypeScript

## Notas de Seguridad
- No compartas tu API key
- `.env` está en `.gitignore`
- Usa variables seguras en producción

## Licencia
Proyecto privado para fines educativos.
