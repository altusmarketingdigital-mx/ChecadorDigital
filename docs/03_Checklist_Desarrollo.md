# Checklist de Desarrollo: Sistema de Control de Asistencia SaaS

Este documento contiene la lista de verificación (checklist) exhaustiva para el desarrollo del sistema, dividida por las fases acordadas y cubriendo los requisitos técnicos, legales y de negocio.

## Fase 1: Análisis, Arquitectura y Modelo de Datos (En curso)
- [x] Definición de la Pila Tecnológica (Tech Stack).
- [x] Documento de Arquitectura de Software.
- [x] Diagrama del Modelo de Datos (Base de Datos).
- [x] Inicialización del repositorio de código (Frontend y Backend).
- [x] Configuración del entorno de desarrollo (Linters, Prettier, Husky).
- [x] Creación de la base de datos en PostgreSQL y configuración del ORM (ej. Prisma/Drizzle).

## Fase 2: Construir la Interfaz y el Sistema de Autenticación
- [x] Configuración del proyecto base con Next.js y Tailwind CSS.
- [x] Implementación de la librería de componentes accesibles (shadcn/ui o similar).
- [x] **Autenticación:** Implementación de Login seguro (MFA, bloqueo de intentos).
- [x] **Multi-tenancy:** Aislamiento de sesiones y datos por empresa (`tenant_id`).
- [x] **Roles y Permisos (RBAC):** Creación de roles (Superadmin, Admin, RRHH, Supervisor, Contador, Trabajador).
- [x] **Dashboard General:** Maquetación del panel principal (estadísticas, empleados presentes, alertas).

## Fase 3: Empleados, Horarios y Registros de Jornada
- [x] **Módulo de Empresa:** CRUD de sucursales y departamentos.
- [x] **Módulo de Empleados:** Alta, baja y edición (con validaciones de campos).
- [x] Implementación de importación masiva de empleados vía Excel/CSV.
- [x] **Módulo de Jornadas:** Configuración de horarios (Diurno, Nocturno, Mixto).
- [x] Configuración de tolerancias, retardos y descansos.
- [x] Motor de cálculo: Evaluación de horas programadas vs. trabajadas (sin auto-aprobar horas extra).
- [x] **Registro Manual/Web:** Interfaz para que trabajadores autorizados registren entrada/salida web.

## Fase 4: Integración del Checador Físico y Sincronización
- [x] **Capa de Integración:** Creación de microservicio/API de recepción (Webhook/TCP).
- [x] Implementación de cola de mensajes (Redis) para ingesta de registros.
- [x] **Adaptador ZKTeco (u otro):** Lógica para interpretar el protocolo del fabricante.
- [x] Detección y filtrado de registros duplicados en ingesta.
- [x] Manejo de eventos offline (preservar hora de origen y registrar hora de recepción).
- [x] Módulo administrativo de Dispositivos (Alta de checadores, estado Online/Offline).
- [x] Interfaz para carga manual de registros por archivo (USB export) con validación de duplicados.

## Fase 5: Incidencias, Auditoría y Reportes
- [x] **Incidencias:** Portal del trabajador para solicitar revisión (falta checada, error, justificación).
- [x] Flujo de aprobación/rechazo de incidencias por parte de RRHH/Supervisor.
- [x] **Correcciones inmutables:** Lógica para insertar correcciones vinculadas al registro original (nunca UPDATE destructivo).
- [x] **Reportes Base:** Desarrollo de Reporte Diario, Semanal, Mensual e Historial individual.
- [x] Exportación de reportes a PDF, Excel y CSV (con cabeceras de identificación de empresa).
- [x] **Paquete STPS:** Generador del "Expediente para requerimientos de autoridad" (Metadatos, bitácora, consistencia).

## Fase 6: Configuración Normativa, Seguridad y Acuerdos
- [x] **Configuración Normativa:** Módulo CRUD para registrar leyes y fechas de entrada en vigor (ej. reforma 1 de mayo de 2026).
- [x] **Acuerdo Legal:** Módulo para enviar y registrar la aceptación del trabajador (evidencia verificable).
- [x] **Bitácora de Auditoría Estricta:** Registro de toda acción crítica (cambios en jornadas, accesos, importaciones).
- [x] Cifrado y sanitización de datos (asegurar que las contraseñas y datos biométricos no viajen expuestos).
- [x] Configuración de respaldos automáticos de la base de datos (Política de retención).

## Fase 7: Pruebas y Despliegue
- [x] **Pruebas de Zona Horaria:** Validar registros de empleados en distintas zonas horarias.
- [x] **Pruebas de Turno Nocturno:** Validar cruce de medianoche en las jornadas.
- [x] **Pruebas de Seguridad:** Penetration testing básico (OWASP) y verificación de aislamiento entre empresas.
- [x] **Pruebas de Integridad:** Comprobar trazabilidad al simular modificaciones y correcciones.
- [x] Preparación de infraestructura Cloud (AWS / Vercel / Supabase, etc.).
- [x] Configuración de CI/CD para despliegues automatizados.
- [x] Redacción de Manuales (Usuario, Administrador e Instalación).
