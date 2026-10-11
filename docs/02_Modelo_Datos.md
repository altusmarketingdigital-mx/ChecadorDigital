# Modelo de Datos (Esquema Conceptual)

Este documento describe las entidades principales de la base de datos PostgreSQL, garantizando el aislamiento por empresa (tenant) y la trazabilidad legal.

```mermaid
erDiagram
    TENANT {
        uuid id PK
        string razon_social
        string rfc
        string nombre_comercial
        string zona_horaria_por_defecto
        boolean activo
    }
    
    SUCURSAL {
        uuid id PK
        uuid tenant_id FK
        string nombre
        string domicilio
        string zona_horaria
    }
    
    DEPARTAMENTO {
        uuid id PK
        uuid tenant_id FK
        uuid sucursal_id FK
        string nombre
    }

    EMPLEADO {
        uuid id PK
        uuid tenant_id FK
        uuid sucursal_id FK
        uuid departamento_id FK
        string numero_empleado
        string nombre_completo
        string puesto
        date fecha_ingreso
        uuid jornada_id FK
        string estado "ACTIVO|BAJA|SUSPENDIDO"
    }

    USUARIO {
        uuid id PK
        uuid tenant_id FK
        uuid empleado_id FK "Opcional"
        string email
        string password_hash
        string rol "SUPERADMIN|ADMIN|RRHH|SUPERVISOR|CONTADOR|TRABAJADOR"
        boolean mfa_habilitado
    }

    DISPOSITIVO {
        uuid id PK
        uuid tenant_id FK
        uuid sucursal_id FK
        string marca
        string modelo
        string numero_serie
        string firmware
        string estado "ONLINE|OFFLINE"
        datetime ultima_sincronizacion
    }

    JORNADA_REGLA {
        uuid id PK
        uuid tenant_id FK
        string nombre
        string tipo "DIURNA|NOCTURNA|MIXTA|ROTATIVA"
        jsonb configuracion_horarios
        int tolerancia_entrada_minutos
    }

    REGISTRO_ASISTENCIA {
        uuid id PK
        uuid tenant_id FK
        uuid empleado_id FK
        uuid dispositivo_id FK "Opcional si es manual/web"
        string tipo_evento "ENTRADA|SALIDA|INICIO_PAUSA|FIN_PAUSA"
        datetime fecha_hora_evento
        string zona_horaria_evento
        datetime fecha_recepcion_servidor
        string metodo_registro "BIOMETRICO|WEB|APP|IMPORTACION"
        string estado_validacion "VALIDO|DUPLICADO|PENDIENTE|CORREGIDO"
        uuid registro_original_id FK "Para trazar correcciones"
    }

    INCIDENCIA_SOLICITUD {
        uuid id PK
        uuid tenant_id FK
        uuid empleado_id FK
        uuid registro_id FK "Opcional"
        string tipo "FALTA_CHEQUEO|JUSTIFICACION|ERROR_DISPOSITIVO"
        string estado "PENDIENTE|APROBADO|RECHAZADO"
        string resolucion
        uuid resuelto_por_usuario_id FK
        datetime fecha_solicitud
        datetime fecha_resolucion
    }

    CONFIGURACION_NORMATIVA {
        uuid id PK
        string fuente_oficial "DOF, LFT, STPS"
        string version_norma
        date fecha_entrada_vigor
        jsonb reglas_aplicables
        string estado "BORRADOR|ACTIVA|OBSOLETA"
    }

    ACUERDO_LEGAL {
        uuid id PK
        uuid tenant_id FK
        uuid empleado_id FK
        string version_documento
        datetime fecha_aceptacion
        string metodo_aceptacion
        string evidencia_hash
    }

    AUDITORIA_LOG {
        uuid id PK
        uuid tenant_id FK
        uuid usuario_id FK
        string accion
        string tabla_afectada
        uuid registro_afectado_id
        jsonb valores_anteriores
        jsonb valores_nuevos
        datetime fecha_hora
        string direccion_ip
        string firma_integridad
    }

    TENANT ||--o{ SUCURSAL : "tiene"
    TENANT ||--o{ DEPARTAMENTO : "tiene"
    TENANT ||--o{ EMPLEADO : "tiene"
    TENANT ||--o{ DISPOSITIVO : "tiene"
    TENANT ||--o{ JORNADA_REGLA : "tiene"
    SUCURSAL ||--o{ DEPARTAMENTO : "contiene"
    SUCURSAL ||--o{ EMPLEADO : "emplea"
    DEPARTAMENTO ||--o{ EMPLEADO : "asigna"
    EMPLEADO ||--o{ REGISTRO_ASISTENCIA : "genera"
    EMPLEADO ||--o{ INCIDENCIA_SOLICITUD : "solicita"
    EMPLEADO ||--o{ ACUERDO_LEGAL : "firma"
    EMPLEADO ||--o| USUARIO : "tiene cuenta"
    DISPOSITIVO ||--o{ REGISTRO_ASISTENCIA : "captura"
    JORNADA_REGLA ||--o{ EMPLEADO : "rige a"
```

## Consideraciones del Modelo
1. **Multi-empresa (SaaS):** Todas las entidades operativas poseen un `tenant_id` obligatorio.
2. **Inmutabilidad en Registros:** `REGISTRO_ASISTENCIA` no se actualiza (UPDATE) cuando hay una corrección. Se inserta un nuevo registro y se vincula mediante `registro_original_id`, conservando el original.
3. **Auditoría Estricta:** `AUDITORIA_LOG` guarda un historial detallado de todas las operaciones críticas, asegurado opcionalmente con un hash encadenado (`firma_integridad`) para evitar alteraciones no detectadas en la base de datos.
4. **Cumplimiento STPS:** `CONFIGURACION_NORMATIVA` permite versionar reglas legales y `ACUERDO_LEGAL` documenta formalmente la aceptación del empleado al uso de medios electrónicos, como lo estipulan las normativas recientes.
