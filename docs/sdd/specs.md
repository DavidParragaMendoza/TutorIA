# Spec Driven Development (SDD) — TutorIA MVP

> El flujo operativo de TutorIA se rige por especificaciones previas formales en notación EARS y formato delta OpenSpec.

---

## 1. Estructura de un Cambio (`Change`)

Cada requerimiento o historia de usuario del `ROADMAP.md` cuenta con una carpeta en `openspec/changes/`:

```text
openspec/changes/<ticket-id>-<nombre-corto>/
├── proposal.md       # Justificación, alcance, roles y dependencias
├── design.md         # Modelos SQLModel, endpoints REST y componentes React
├── tasks.md          # Checklist atómico de tareas de implementación
└── specs/
    └── <capability>/
        └── spec.md   # Requerimientos en notación EARS y escenarios Gherkin
```

---

## 2. Redacción de Requerimientos en Notación EARS (Español)

Cada requisito funcional debe formularse bajo uno de los 5 patrones EARS:

1. **Ubicuo (Comportamiento continuo del sistema)**:
   - `EL SISTEMA DEBE <acción o restricción>.`
   - *Ejemplo*: `EL SISTEMA DEBE mantener bloqueada la entrada de texto libre en el teclado durante el chat de vocabulario.`
2. **Evento (Disparado por una acción externa o del usuario)**:
   - `CUANDO <evento disparador>, EL SISTEMA DEBE <acción>.`
   - *Ejemplo*: `CUANDO el estudiante seleccione una opción de respuesta, EL SISTEMA DEBE mostrar retroalimentación visual inmediata.`
3. **Estado (Condicionado a una situación activa)**:
   - `MIENTRAS <estado activo>, EL SISTEMA DEBE <acción>.`
   - *Ejemplo*: `MIENTRAS se envíe una consulta a AnythingLLM, EL SISTEMA DEBE seudonimizar el identificador con hash SHA-256.`
4. **Opcional (Habilitado sólo si aplica una condición opcional)**:
   - `DONDE <característica o contexto opcional>, EL SISTEMA DEBE <acción>.`
   - *Ejemplo*: `DONDE el docente active el modo estricto, EL SISTEMA DEBE reducir el tiempo límite de respuesta a 20 segundos.`
5. **No Deseado / Excepción (Manejo defensivo ante fallos)**:
   - `SI <evento no deseado o falla>, ENTONCES EL SISTEMA DEBE <acción correctiva>.`
   - *Ejemplo*: `SI AnythingLLM supera 3.0 segundos de timeout, ENTONCES EL SISTEMA DEBE despachar reactivos estáticos desde MySQL.`

---

## 3. Escenarios Gherkin en Español

Cada requisito en `spec.md` se acompaña de escenarios concretos:

```gherkin
#### Scenario: Autenticación exitosa de estudiante
Dado que existe un usuario estudiante registrado con correo "alumno@tutoria.edu" y clave válida
Cuando envía sus credenciales al endpoint "/api/v1/login"
Entonces el sistema retorna un código HTTP 200 con un token JWT válido y el rol "Estudiante"
```

---

## 4. Formato Delta OpenSpec

Al modificar capabilities canónicas, se especifica el delta explícito:
- `## ADDED Requirements`: Requisitos nuevos que se incorporan.
- `## MODIFIED Requirements`: Requisitos previos que cambian en este ciclo.
- `## REMOVED Requirements`: Requisitos obsoletos que se retiran.
