# Plan de Trabajo: Sistema de Control de Asistencia SaaS

Este plan de trabajo detalla la ruta de ejecución para la construcción de la plataforma, estimando tiempos, asignando roles y estableciendo los entregables clave por etapa.

## 1. Metodología y Equipo
El desarrollo se ejecutará mediante un modelo **Iterativo e Incremental (Agile)**, dividiendo el trabajo en **Sprints de 2 semanas**. 

**Roles Involucrados:**
* **Arquitecto / Tech Lead:** Diseño del sistema, revisión de código, infraestructura.
* **Desarrollador Full-Stack:** Implementación de Frontend (Next.js) y Backend (Node.js/APIs).
* **Especialista UX/UI:** Diseño de interfaces, accesibilidad y experiencia del usuario.
* **Consultor HR / Legal:** Validación de cálculos de jornada, reportes LFT/STPS y evidencias legales.
* **Especialista Ciberseguridad:** Pentesting, validación de aislamiento de inquilinos y cifrado.

---

## 2. Cronograma de Ejecución (Estimado: 12 Semanas)

### Sprint 1: Fase 1 - Arquitectura y Configuración Base (Semana 1 - 2)
* **Objetivos:** Finalizar diseño de datos, configurar repositorios y entornos.
* **Actividades:**
  * Validar modelo de base de datos y arquitectura (Completado).
  * Inicializar repositorio monorepo (Next.js + Backend).
  * Configurar CI/CD básico y linters.
  * Crear la base de datos PostgreSQL y configurar el ORM (Prisma/Drizzle).
* **Entregables:** Documento de Arquitectura, Repositorio Base funcional, Esquema de BD desplegado en local.

### Sprint 2: Fase 2 - Interfaz y Autenticación (Semana 3 - 4)
* **Objetivos:** Crear el "esqueleto" visual y el acceso seguro.
* **Actividades:**
  * Diseño UI/UX de los paneles principales (Wireframes a Alta Fidelidad).
  * Integrar proveedor de identidad (Login, MFA, reseteo de contraseña).
  * Implementar estructura "Multi-tenant" (Empresas) y Control de Roles (RBAC).
  * Desarrollo del Layout y Sidebar.
* **Entregables:** Sistema con login funcional, aislamiento por empresa y navegación base.

### Sprint 3: Fase 3 - Empleados y Reglas de Jornada (Semana 5 - 6)
* **Objetivos:** Gestión de catálogos principales y lógica de negocio laboral.
* **Actividades:**
  * CRUD de Sucursales y Departamentos.
  * CRUD de Empleados y módulo de importación masiva por CSV.
  * Motor de creación de Horarios (Diurnos, Nocturnos, Mixtos) con tolerancias.
  * Módulo de registro de asistencia manual/web.
* **Entregables:** Catálogos de RH operativos y capacidad de registrar asistencias vía web.

### Sprint 4: Fase 4 - Integración de Checadores (Semana 7 - 8)
* **Objetivos:** Conexión con hardware físico.
* **Actividades:**
  * Despliegue de microservicio adaptador para hardware (ej. ZKTeco).
  * Configuración de cola Redis para manejar picos de concurrencia.
  * Lógica de resolución de duplicados y eventos "offline".
  * Módulo administrativo para dar de alta terminales.
* **Entregables:** El sistema puede recibir, procesar y almacenar "chequeos" desde un dispositivo físico real (o simulador de hardware).

### Sprint 5: Fase 5 - Incidencias y Motor de Reportes (Semana 9 - 10)
* **Objetivos:** Gestión de excepciones y cumplimiento de autoridad.
* **Actividades:**
  * Portal del trabajador (solicitudes de corrección y aclaraciones).
  * Flujo de aprobación para RH y registro inmutable (vinculación original -> corrección).
  * Desarrollo del "Paquete de Requerimiento STPS".
  * Exportación de reportes PDF y Excel.
* **Entregables:** Panel de control de incidencias, PDFs generados y expedientes legales armados.

### Sprint 6: Fase 6 y 7 - Normativa, Seguridad y Lanzamiento (Semana 11 - 12)
* **Objetivos:** Blindaje legal, auditoría técnica y paso a producción.
* **Actividades:**
  * Implementar módulo de "Configuración Normativa" e historial de cambios.
  * Módulo de firma y aceptación de "Acuerdo Legal" por parte del trabajador.
  * Ejecutar pruebas de carga, pruebas de seguridad cruzada (Multi-tenant) y E2E (turnos nocturnos, zonas horarias).
  * Configurar respaldos automáticos en la nube.
  * Despliegue en el entorno de Producción.
* **Entregables:** Manuales de usuario, Reporte de Pentesting, Sistema en Producción.

---

## 3. Gestión de Riesgos
| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| **Falta de documentación del Checador** | Alto | Solicitar manuales de API/SDK (Push/Pull) al fabricante en la Semana 1. Preparar fallback con importación USB. |
| **Cambios repentinos en LFT/STPS** | Medio | Uso exclusivo del "Módulo de Configuración Normativa". La lógica dura no está en código, sino en base de datos. |
| **Problemas de Zona Horaria** | Alto | Almacenar siempre en formato UTC (`TIMESTAMP WITH TIME ZONE`). Aplicar zona horaria de la sucursal solo en la capa de vista (Frontend/Reportes). |

## 4. Criterios de Aceptación Global
El código no se fusiona a la rama principal sin:
1. Revisiones de seguridad aprobadas.
2. Cero sobrescrituras en la tabla de registros biométricos (inmutabilidad).
3. Confirmación del Consultor RH sobre la exactitud matemática de las jornadas y horas extras calculadas.
