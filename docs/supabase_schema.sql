-- ====================================================================
-- ESQUEMA COMPLETO PARA SUPABASE (POSTGRESQL)
-- SISTEMA DE CONTROL DE ASISTENCIA LABORAL SAAS
-- ====================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE EMPRESAS / INQUILINOS (MULTI-TENANT)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razon_social VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    zona_horaria_por_defecto VARCHAR(100) DEFAULT 'America/Mexico_City',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE SUCURSALES
CREATE TABLE IF NOT EXISTS sucursales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    domicilio TEXT NOT NULL,
    zona_horaria VARCHAR(100) DEFAULT 'America/Mexico_City' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL
);

-- 5. TABLA DE REGLAS DE JORNADA (LFT)
CREATE TABLE IF NOT EXISTS jornadas_reglas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- DIURNA, NOCTURNA, MIXTA, ROTATIVA
    configuracion_horarios JSONB NOT NULL,
    tolerancia_entrada_minutos INT DEFAULT 10 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE EMPLEADOS
CREATE TABLE IF NOT EXISTS empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE RESTRICT,
    departamento_id UUID NOT NULL REFERENCES departamentos(id) ON DELETE RESTRICT,
    numero_empleado VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    puesto VARCHAR(150) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    jornada_id UUID REFERENCES jornadas_reglas(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'ACTIVO' NOT NULL, -- ACTIVO, BAJA, SUSPENDIDO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_empleado_tenant UNIQUE (tenant_id, numero_empleado)
);

-- 7. TABLA DE USUARIOS Y ROLES (RBAC)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    empleado_id UUID UNIQUE REFERENCES empleados(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'TRABAJADOR' NOT NULL, -- SUPERADMIN, ADMIN, RRHH, SUPERVISOR, CONTADOR, TRABAJADOR
    mfa_habilitado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA DE TERMINALES Y CHECADORES FÍSICOS
CREATE TABLE IF NOT EXISTS dispositivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) UNIQUE NOT NULL,
    firmware VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'OFFLINE' NOT NULL, -- ONLINE, OFFLINE
    ultima_sincronizacion TIMESTAMP WITH TIME ZONE
);

-- 9. TABLA DE REGISTROS DE ASISTENCIA (INMUTABLE)
CREATE TABLE IF NOT EXISTS registros_asistencia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT,
    dispositivo_id UUID REFERENCES dispositivos(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- ENTRADA, SALIDA, INICIO_PAUSA, FIN_PAUSA
    fecha_hora_evento TIMESTAMP WITH TIME ZONE NOT NULL,
    zona_horaria_evento VARCHAR(100) NOT NULL,
    fecha_recepcion_servidor TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metodo_registro VARCHAR(50) NOT NULL, -- BIOMETRICO, WEB, APP, IMPORTACION
    estado_validacion VARCHAR(50) DEFAULT 'VALIDO' NOT NULL, -- VALIDO, DUPLICADO, PENDIENTE, CORREGIDO
    registro_original_id UUID REFERENCES registros_asistencia(id) ON DELETE RESTRICT
);

-- 10. TABLA DE INCIDENCIAS Y ACLARACIONES
CREATE TABLE IF NOT EXISTS incidencias_solicitudes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    registro_id UUID REFERENCES registros_asistencia(id) ON DELETE SET NULL,
    tipo VARCHAR(100) NOT NULL, -- FALTA_CHEQUEO, JUSTIFICACION, ERROR_DISPOSITIVO
    estado VARCHAR(50) DEFAULT 'PENDIENTE' NOT NULL, -- PENDIENTE, APROBADO, RECHAZADO
    resolucion TEXT,
    resuelto_por_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    fecha_resolucion TIMESTAMP WITH TIME ZONE
);

-- 11. TABLA DE CONFIGURACIÓN NORMATIVA (REFORMAS DOF / STPS)
CREATE TABLE IF NOT EXISTS configuracion_normativa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fuente_oficial VARCHAR(100) NOT NULL, -- DOF, LFT, STPS
    version_norma VARCHAR(50) NOT NULL,
    fecha_entrada_vigor DATE NOT NULL,
    reglas_aplicables JSONB NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR' NOT NULL -- BORRADOR, ACTIVA, OBSOLETA
);

-- 12. TABLA DE ACUERDOS Y CONSENTIMIENTOS LEGALES
CREATE TABLE IF NOT EXISTS acuerdos_legales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    empleado_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
    version_documento VARCHAR(50) NOT NULL,
    fecha_aceptacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metodo_aceptacion VARCHAR(50) NOT NULL, -- FIRMA_DIGITAL, CHECKBOX, HUELLA
    evidencia_hash VARCHAR(64) NOT NULL -- SHA-256
);

-- 13. TABLA DE BITÁCORA DE AUDITORÍA FORENSE
CREATE TABLE IF NOT EXISTS auditoria_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_afectado_id VARCHAR(100) NOT NULL,
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    direccion_ip VARCHAR(50),
    firma_integridad VARCHAR(64)
);

-- ====================================================================
-- ÍNDICES PARA ALTO RENDIMIENTO (CHECADOR EN TIEMPO REAL)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_registros_empleado_fecha ON registros_asistencia(empleado_id, fecha_hora_evento);
CREATE INDEX IF NOT EXISTS idx_registros_tenant ON registros_asistencia(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dispositivos_serie ON dispositivos(numero_serie);
CREATE INDEX IF NOT EXISTS idx_auditoria_tenant_fecha ON auditoria_logs(tenant_id, fecha_hora);
