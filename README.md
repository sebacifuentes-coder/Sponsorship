# MetodoBMAD

Plataforma en desarrollo siguiendo el **Método BMAD** (BMad Method).

## Flujo de trabajo

El desarrollo sigue un proceso colaborativo:

1. **Desarrollo local** — La planificación y el prototipo se construyen en local con los agentes BMAD.
2. **Revisión en GitHub** — Cada avance se versiona y se publica para revisión.
3. **Producción** — El desarrollador profesional revisa, refactoriza y lleva la plataforma a un entorno productivo.

## Estructura del proyecto

| Carpeta | Contenido |
|---|---|
| `_bmad-output/planning-artifacts/` | Brief, PRD, arquitectura, épicas e historias |
| `_bmad-output/implementation-artifacts/` | Artefactos del ciclo de implementación |
| `_bmad-output/test-artifacts/` | Diseño y reportes de pruebas |
| `docs/` | Conocimiento del proyecto y documentación |
| `_bmad/` | Configuración del método BMAD |

## Fases BMAD

1. **Análisis** — brainstorming, brief, investigación.
2. **Planificación** — PRD (+ UX).
3. **Solución** — arquitectura, épicas e historias, readiness.
4. **Implementación** — ciclo sprint: crear historia → desarrollar → revisar → QA.

## Para el desarrollador

Antes de revisar el código, consulta los artefactos de planificación en `_bmad-output/planning-artifacts/`: explican el *qué* y el *porqué* de cada decisión.
