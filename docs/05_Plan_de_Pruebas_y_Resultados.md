# Plan de Pruebas y Resultados de Integridad

Este documento valida el cumplimiento de las pruebas críticas requeridas para el control de asistencia laboral y cumplimiento normativo ante la STPS.

## 1. Pruebas de Jornada Nocturna (Cruce de Medianoche)
* **Escenario:** Un guardia de seguridad entra a laborar a las 20:00 hrs y finaliza su turno a las 04:00 hrs del día siguiente.
* **Riesgo:** Que el sistema interprete la salida como una "Entrada sin salida" del día 1 y una "Salida sin entrada" del día 2.
* **Resultado del Motor:** **APROBADO.** El motor calcula la jornada evaluando ventanas de turno de 24 horas a partir del evento de inicio, asociando la salida del día siguiente a la misma jornada laboral y computando exactamente 7 horas efectivas (conforme al Art. 60 de la LFT).

## 2. Pruebas de Zonas Horarias Múltiples
* **Escenario:** Una empresa tiene una sucursal en Tijuana (`America/Tijuana`, UTC-7/8) y otra en Ciudad de México (`America/Mexico_City`, UTC-6).
* **Riesgo:** Desfases de asistencia al consolidar reportes en el panel central de Recursos Humanos.
* **Resultado del Motor:** **APROBADO.** Todos los registros se persisten en la base de datos en formato universal UTC (`TIMESTAMP WITH TIME ZONE`). La conversión se realiza de forma contextual usando la zona horaria de la sucursal del empleado, evitando discrepancias legales.

## 3. Pruebas de Seguridad y Aislamiento Multi-Tenant
* **Escenario:** Un usuario de la Empresa "A" intenta manipular una petición API modificando el `empleadoId` para consultar la asistencia de un trabajador de la Empresa "B".
* **Resultado del Motor:** **APROBADO.** El Middleware (`src/middleware.ts`) y la capa ORM inyectan el filtro `tenant_id` obligatorio. El sistema retorna un error `403 Forbidden` y genera una alerta en la bitácora de auditoría.

## 4. Pruebas de Integridad y Trazabilidad (Auditoría Forense)
* **Escenario:** Se aprueba una justificación de omisión de checada.
* **Resultado del Motor:** **APROBADO.** La base de datos no ejecuta ninguna sentencia `UPDATE` o `DELETE` destructiva sobre los registros de huella. Se inserta un nuevo registro con `registroOriginalId` enlazado y se genera un hash criptográfico de integridad SHA-256 en la tabla `AuditoriaLog`.
