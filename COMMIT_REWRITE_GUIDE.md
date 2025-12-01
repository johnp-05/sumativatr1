# 📝 Guía para Reescribir Mensajes de Commits

Esta guía te ayudará a reescribir los mensajes de commits del repositorio usando el formato con emojis.

## 📌 Formato de Commits Recomendado

| Emoji | Tipo | Descripción |
|-------|------|-------------|
| ✨ | feat | Nueva funcionalidad |
| 🐛 | fix | Corrección de bugs |
| ♻️ | refactor | Refactorización de código |
| 🎨 | style | Cambios de estilo (no funcionales) |
| 🧪 | test | Nuevas pruebas o actualizaciones |
| 📚 | docs | Documentación |
| 🔥 | remove | Eliminación de código o archivos |
| 🚀 | perf | Mejora de rendimiento |
| 🔧 | chore | Configuración o mantenimiento |
| 📦 | build | Empaquetado o dependencias |
| 🚨 | lint | Correcciones de linter |
| 💄 | ui | Cambios en la interfaz de usuario |
| 🧹 | cleanup | Limpieza general de código o dependencias |

---

## 🔄 Commits que Necesitan Ser Reescritos (Con Mensajes Detallados)

A continuación están los commits actuales con los mensajes sugeridos incluyendo descripción detallada de los cambios:

---

### Commit `05ff065` (Mensaje original: "lol q mal")

**Mensaje sugerido:**
```
✨ feat: Implementar sistema completo de gestión de tareas con vault y contexto

- Se agregó el layout de tabs con navegación inferior (app/(tabs)/_layout.tsx)
- Se creó la pantalla de exploración con listado de tareas (app/(tabs)/explore.tsx)
- Se implementó la pantalla principal de inicio (app/(tabs)/index.tsx)
- Se agregó la vista del vault con gestión de tareas (app/(tabs)/vault.tsx)
- Se mejoró el layout principal de la aplicación (app/_layout.tsx)
- Se expandió la funcionalidad del index principal (app/index.tsx)
- Se creó la vista de detalle de tarea (app/task/[id].tsx)
- Se implementó el formulario de creación de tareas (app/task/create.tsx)
- Se agregó la vista de tareas del vault (app/vault/index.tsx)
- Se creó el componente TaskCard para mostrar tareas (componets/TaskCard.tsx)
- Se implementó el contexto del vault para manejo de estado (context/vault-context.tsx)
- Se definió el schema de validación de tareas (lib/schemas/task.schema.ts)
- Se actualizaron las dependencias del proyecto (package.json, package-lock.json)
```

---

### Commit `0322367` (Mensaje original: "xddd")

**Mensaje sugerido:**
```
♻️ refactor: Renombrar y mejorar módulo de tareas del vault

- Se renombró app/vault/index.tsx a app/vault/tasks.tsx para mayor claridad
- Se mejoró la lógica del componente de tareas del vault con 106 líneas nuevas
- Se actualizó la referencia en app/(tabs)/vault.tsx al nuevo nombre del archivo
```

---

### Commit `abd69ed` (Mensaje original: "LOL QMAL XDD")

**Mensaje sugerido:**
```
💄 ui: Actualizar layout de tabs y pantalla de exploración

- Se actualizó la configuración del .env.example con nuevas variables
- Se modificó el layout de tabs para mejorar la navegación (app/(tabs)/_layout.tsx)
- Se expandió la pantalla de exploración con 53 líneas nuevas (app/(tabs)/explore.tsx)
- Se mejoró el layout principal con 18 líneas adicionales (app/_layout.tsx)
- Se creó el archivo placeholder app/gemini.tsx para futura integración
```

---

### Commit `4d58d47` (Mensaje original: "POM")

**Mensaje sugerido:**
```
✨ feat: Integrar servicio Gemini mejorado con nuevas funcionalidades

- Se simplificó la configuración del .env.example
- Se expandió significativamente la pantalla de exploración (app/(tabs)/explore.tsx)
- Se mejoró la pantalla principal con nuevas funcionalidades (app/(tabs)/index.tsx)
- Se actualizó la vista del vault (app/(tabs)/vault.tsx)
- Se ajustó el formulario de creación de tareas (app/task/create.tsx)
- Se mejoró la vista de tareas del vault (app/vault/tasks.tsx)
- Se actualizaron las dependencias con nuevos paquetes (package-lock.json)
- Se expandió el servicio de Gemini con 73 líneas nuevas (services/gemini-service.ts)
```

---

### Commit `2641909` (Mensaje original: "homero")

**Mensaje sugerido:**
```
♻️ refactor: Limpiar código y reorganizar estructura de servicios

- Se eliminaron variables innecesarias del .env.example
- Se removió el archivo .gitignore redundante
- Se simplificó el archivo app/index.tsx eliminando 117 líneas de código duplicado
- Se reorganizó el formulario de creación de tareas (app/task/create.tsx)
- Se mejoró la vista de tareas del vault (app/vault/tasks.tsx)
- Se agregó el middleware CORS para el servidor (cors-middleware.js)
- Se actualizó la base de datos JSON con nuevos datos (db.json)
- Se actualizaron las dependencias del proyecto (package.json)
- Se simplificó el servicio de Gemini eliminando código redundante (services/gemini-service.ts)
```

---

### Commit `a70ca43` (Mensaje original: "lol")

**Mensaje sugerido:**
```
✨ feat: Mejorar sistema de tareas con IA de Gemini y servicios actualizados

- Se mejoró la pantalla de exploración con mejor UX (app/(tabs)/explore.tsx)
- Se expandió la vista de detalle de tarea con 87 líneas nuevas (app/task/[id].tsx)
- Se mejoró el formulario de creación con validaciones (app/task/create.tsx)
- Se refactorizó completamente la vista de tareas del vault (app/vault/tasks.tsx)
- Se actualizó la base de datos JSON con nuevos campos (db.json)
- Se expandió el servicio de Gemini con funcionalidades de IA (services/gemini-service.ts)
- Se mejoró el servicio de tareas con nuevos métodos (services/task-service.ts)
```

---

### Commit `ab13971` (Mensaje original: "tratar de corregir errores")

**Mensaje sugerido:**
```
♻️ refactor: Simplificar servicios de tareas y componentes del vault

- Se mejoró la pantalla principal con 30 líneas adicionales (app/(tabs)/index.tsx)
- Se actualizó la vista del vault con mejor manejo de estado (app/(tabs)/vault.tsx)
- Se simplificó el formulario de creación eliminando código duplicado (app/task/create.tsx)
- Se refactorizó la vista de tareas del vault (app/vault/tasks.tsx)
- Se actualizó la base de datos JSON (db.json)
- Se actualizaron las dependencias del proyecto (package.json)
- Se corrigió la configuración del servicio de Gemini (services/gemini-service.ts)
- Se simplificó el servicio de tareas eliminando lógica redundante (services/task-service.ts)
```

---

### Commit `708c030` (Mensaje original: "volver a tratar de corregir")

**Mensaje sugerido:**
```
🐛 fix: Corregir configuración de servicios y contexto de vault

- Se actualizó la configuración del app.json con nuevos ajustes
- Se expandió el contexto del vault con 95 líneas de mejoras (context/vault-context.tsx)
- Se agregaron nuevas dependencias al proyecto (package-lock.json, package.json)
- Se refactorizó el servicio de Gemini con mejor manejo de errores (services/gemini-service.ts)
- Se mejoró el servicio de tareas con 111 líneas nuevas (services/task-service.ts)
```

---

### Commit `299a524` (Mensaje original: "holaa")

**Mensaje sugerido:**
```
✨ feat: Actualizar URLs de servicios para conexión local

- Se actualizó la URL del servicio de Gemini para desarrollo local (services/gemini-service.ts)
- Se actualizó la URL del servicio de tareas para desarrollo local (services/task-service.ts)
```

---

## 🚀 Pasos para Reescribir los Commits

### Opción 1: Rebase Interactivo (Recomendado)

Ejecuta los siguientes comandos en tu terminal local:

```bash
# 1. Asegúrate de estar en la rama correcta
git checkout copilot/rewrite-commit-messages

# 2. Inicia el rebase interactivo desde el commit inicial
git rebase -i 4ac3454

# 3. En el editor que se abre, cambia "pick" por "reword" (o "r") 
#    para cada commit que quieras modificar:
#
#    r 05ff065 lol q mal
#    r 0322367 xddd
#    r abd69ed LOL QMAL XDD
#    r 4d58d47 POM
#    r 2641909 homero
#    r a70ca43 lol
#    r ab13971 tratar de corregir errores
#    r 708c030 volver a tratar de corregir
#    r 299a524 holaa
#    pick c6db5f2 Initial plan

# 4. Guarda y cierra el editor

# 5. Git abrirá un editor para cada commit marcado con "reword"
#    Reemplaza el mensaje con el sugerido arriba

# 6. Una vez terminado, fuerza el push al remoto
git push --force origin copilot/rewrite-commit-messages
```

### Opción 2: Script Automatizado (Alternativa)

> ⚠️ **Nota**: `git filter-branch` está deprecado. Para proyectos nuevos, considera usar `git filter-repo`. Este script se proporciona como referencia.

> 💡 **Recomendación**: Para mensajes multilínea como los sugeridos arriba, es mejor usar la **Opción 1 (Rebase Interactivo)** ya que permite editar cada mensaje manualmente con el formato completo.

Si solo quieres cambiar la primera línea de cada commit, puedes usar este script en tu máquina local:

```bash
#!/bin/bash

# Script para reescribir la primera línea de commits automáticamente
# ADVERTENCIA: Esto reescribirá el historial. Úsalo con cuidado.

# Guarda esto como rewrite-commits.sh y ejecuta: bash rewrite-commits.sh

# Configura el commit inicial desde donde empezar
START_COMMIT="05ff065"

git filter-branch -f --msg-filter '
case "$GIT_COMMIT" in
  299a524*)
    echo "✨ feat: Actualizar URLs de servicios para conexión local"
    ;;
  708c030*)
    echo "🐛 fix: Corregir configuración de servicios y contexto de vault"
    ;;
  ab13971*)
    echo "♻️ refactor: Simplificar servicios de tareas y componentes del vault"
    ;;
  a70ca43*)
    echo "✨ feat: Mejorar sistema de tareas con IA de Gemini y servicios actualizados"
    ;;
  2641909*)
    echo "♻️ refactor: Limpiar código y reorganizar estructura de servicios"
    ;;
  4d58d47*)
    echo "✨ feat: Integrar servicio Gemini mejorado con nuevas funcionalidades"
    ;;
  abd69ed*)
    echo "💄 ui: Actualizar layout de tabs y pantalla de exploración"
    ;;
  0322367*)
    echo "♻️ refactor: Renombrar y mejorar módulo de tareas del vault"
    ;;
  05ff065*)
    echo "✨ feat: Implementar sistema completo de gestión de tareas con vault y contexto"
    ;;
  *)
    cat
    ;;
esac
' -- ${START_COMMIT}^..HEAD

# Después del script, ejecuta:
# git push --force origin copilot/rewrite-commit-messages
```

---

## ⚠️ Consideraciones Importantes

1. **Backup**: Antes de reescribir, crea una rama de respaldo:
   ```bash
   git branch backup-before-rewrite
   ```

2. **Force Push**: Después de reescribir, necesitarás hacer `git push --force`

3. **Colaboradores**: Si otros están trabajando en esta rama, coordina con ellos primero

4. **SHAs Cambian**: Los commits reescritos tendrán nuevos hashes (SHAs)

---

## 📋 Resumen de Cambios Sugeridos

Los commits que necesitan mejores mensajes son aquellos con nombres poco descriptivos:
- `holaa`, `lol`, `xddd`, `homero`, `POM`, `LOL QMAL XDD`
- `lol q mal`, `tratar de corregir errores`, `volver a tratar de corregir`

Los commits que ya tienen buenos mensajes y NO necesitan cambios:
- `🧹 Limpieza: Dependencias reinstaladas y cachés purgadas`
- `Address code review feedback: sanitize inputs, use env vars, extract constants`
- `📦 build: Instalar y configurar Lucide Icons`
- `🛠️ chore: Configuración inicial de entorno de desarrollo y estilos`

---

*Generado automáticamente para ayudarte a mantener un historial de commits limpio y profesional* 🚀
