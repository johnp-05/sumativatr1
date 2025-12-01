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
| 🔥 | chore | Eliminaciones, limpieza |
| 🚀 | perf | Mejora de rendimiento |
| 🔧 | chore | Configuración o mantenimiento |
| 📦 | build | Empaquetado o dependencias |
| 🚨 | lint | Correcciones de linter |
| 💄 | ui | Cambios en la interfaz de usuario |

---

## 🔄 Commits que Necesitan Ser Reescritos

A continuación están los commits actuales y los mensajes sugeridos:

| Commit Actual | Mensaje Original | ➡️ Mensaje Sugerido |
|---------------|------------------|---------------------|
| `299a524` | holaa | ✨ feat: Actualizar URLs de servicios para conexión local |
| `708c030` | volver a tratar de corregir | 🐛 fix: Corregir configuración de servicios y contexto de vault |
| `ab13971` | tratar de corregir errores | ♻️ refactor: Simplificar servicios de tareas y componentes del vault |
| `a70ca43` | lol | ✨ feat: Mejorar sistema de tareas con IA de Gemini y servicios actualizados |
| `2641909` | homero | ♻️ refactor: Limpiar código y reorganizar estructura de servicios |
| `4d58d47` | POM | ✨ feat: Integrar servicio Gemini mejorado con nuevas funcionalidades |
| `abd69ed` | LOL QMAL XDD | 💄 ui: Actualizar layout de tabs y pantalla de exploración |
| `0322367` | xddd | ♻️ refactor: Renombrar y mejorar módulo de tareas del vault |
| `05ff065` | lol q mal | ✨ feat: Implementar sistema completo de gestión de tareas con vault y contexto |

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

### Opción 2: Script Automatizado

Crea y ejecuta este script en tu máquina local:

```bash
#!/bin/bash

# Script para reescribir commits automáticamente
# ADVERTENCIA: Esto reescribirá el historial. Úsalo con cuidado.

# Guarda esto como rewrite-commits.sh y ejecuta: bash rewrite-commits.sh

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
' -- 05ff065^..HEAD

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

Los commits que ya tienen buenos mensajes y NO necesitan cambios:
- `🧹 Limpieza: Dependencias reinstaladas y cachés purgadas`
- `Address code review feedback: sanitize inputs, use env vars, extract constants`
- `📦 build: Instalar y configurar Lucide Icons`
- `🛠️ chore: Configuración inicial de entorno de desarrollo y estilos`

---

*Generado automáticamente para ayudarte a mantener un historial de commits limpio y profesional* 🚀
