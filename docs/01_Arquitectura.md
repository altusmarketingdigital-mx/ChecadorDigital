# Arquitectura del Sistema: Control de Asistencia Laboral en la Nube

## 1. Visión General
El sistema es una plataforma SaaS (Software as a Service) multi-inquilino (multi-tenant) diseñada para gestionar el control de asistencia laboral en México. Cumple con las normativas de la Ley Federal del Trabajo (incluyendo la reforma del 1 de mayo de 2026) y disposiciones de la STPS.

## 2. Pila Tecnológica (Tech Stack)
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui (para componentes accesibles).
* **Backend:** Node.js / NestJS (ideal para arquitectura modular e integraciones de hardware) o Next.js API Routes.
* **Base de Datos:** PostgreSQL.
* **ORM:** Prisma o Drizzle ORM (facilita el tipado estricto y las migraciones).
* **Autenticación:** Auth0, Clerk, o solución propia basada en JWT con MFA y Control de Acceso Basado en Roles (RBAC).
* **Almacenamiento (Archivos/Evidencias):** Amazon S3 o compatible.
* **Caché y Colas:** Redis (fundamental para encolar eventos de checadores físicos y gestionar reintentos de sincronización).

## 3. Topología de Componentes

### 3.1. Aplicación Web (Frontend)
Aplicación SPA/SSR que sirve los distintos paneles:
* **Panel Superadmin:** Gestión de inquilinos (empresas), planes, auditoría global y configuración normativa maestra.
* **Panel Empresa (Dashboard):** Vistas para Administradores, RRHH, Supervisores, Contadores y Trabajadores.
* **Portal del Trabajador:** Interfaz móvil-friendly para consulta de jornadas, incidencias y aceptación de acuerdos (firma digital simple/evidencia).

### 3.2. Core API (Backend)
Servicio centralizado que maneja la lógica de negocio:
* **Gestión de Identidad y Accesos (IAM):** Manejo de sesiones, MFA, aislamiento de datos por inquilino (Tenant-ID).
* **Motor de Reglas Laborales:** Módulo que evalúa las horas trabajadas contra las reglas configuradas (Límites LFT, tolerancias, horas extras).
* **Gestión de Auditoría:** Inserción inmutable de eventos críticos.
* **Generador de Reportes:** Motor para generar PDFs y exportar a Excel/CSV.

### 3.3. Capa de Integración de Dispositivos (Biometric Adapter Layer)
Microservicio desacoplado responsable de la comunicación con los checadores (ej. ZKTeco ADMS / WDMS).
* **Webhook Receivers:** Para recibir peticiones "push" desde los checadores.
* **Queue System (Redis):** Encola los registros ("punch") garantizando que no se pierdan si la base de datos principal está bajo carga.
* **Parser de Fabricante:** Traduce el protocolo específico (ej. ZKTeco, Suprema) al formato estándar interno del sistema.
* **Detector de Duplicados e Integridad:** Valida la hora del evento y el origen antes de insertarlo en la base principal.

## 4. Aislamiento de Datos y Seguridad
* **Multi-tenancy:** Implementado a nivel de base de datos usando "Row Level Security" (RLS) en PostgreSQL o filtrado estricto por `tenant_id` en todas las consultas del ORM.
* **Cifrado:** TLS 1.3 en tránsito. Cifrado AES-256 en reposo para datos sensibles. Los datos biométricos (plantillas) idealmente *no* se centralizan; si es necesario, se almacenan como hashes irreversibles o blobs cifrados, nunca imágenes crudas.
* **Auditoría:** Tabla de `audit_logs` que registra `user_id`, `tenant_id`, `action`, `table_name`, `old_value`, `new_value`, `ip_address`, y `timestamp`. Posible implementación de firmas criptográficas encadenadas por registro para garantizar inmutabilidad ante revisiones.
