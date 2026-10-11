# Guía de Instalación y Despliegue en la Nube

Esta guía describe cómo desplegar la plataforma SaaS en un entorno de producción (Cloud).

## 1. Requisitos Previos
* **Node.js:** Versión 18.x o 20.x LTS.
* **Base de Datos:** Instancia administrada de PostgreSQL (ej. AWS RDS, Supabase, Neon o servidor dedicado).
* **Cola de Mensajes:** Servidor Redis (para recepción masiva de checadores de huella).
* **Almacenamiento:** Bucket compatible con S3 (para evidencias médicas y documentos de acuerdos legales).

## 2. Variables de Entorno (`.env`)
Crear el archivo `.env` en la raíz de `platform/` con los siguientes parámetros:

```env
# Conexión a la Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/checador_saas?schema=public"

# Seguridad y Criptografía
NEXTAUTH_SECRET="tu_clave_secreta_super_segura_aqui"
NEXTAUTH_URL="https://tu-plataforma-saas.com"

# Redis para eventos de hardware
REDIS_URL="redis://localhost:6379"

# S3 Almacenamiento de Evidencias
AWS_ACCESS_KEY_ID="tu_access_key"
AWS_SECRET_ACCESS_KEY="tu_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="evidencias-asistencia"
```

## 3. Despliegue de la Base de Datos
Ejecutar las migraciones de Prisma para construir el esquema relacional multi-tenant:
```bash
cd platform
npx prisma migrate dev --name init
npx prisma generate
```

## 4. Despliegue en Producción (Vercel / Docker / Servidor Linux)

### Opción A: Vercel (Recomendado para el Frontend Next.js)
1. Vincular el repositorio a Vercel.
2. Configurar las variables de entorno en el panel de Vercel.
3. El despliegue se realizará de forma automática con soporte para Edge Middleware.

### Opción B: Servidor Propio con PM2 / Docker
```bash
cd platform
npm run build
pm2 start npm --name "checador-saas" -- start
```

## 5. Configuración del Checador Físico
1. En el menú del lector de huellas (ZKTeco o compatible), ingresar a la sección de **Configuración de Red / Servidor en la Nube (ADMS)**.
2. Configurar la URL del servidor: `https://tu-plataforma-saas.com/api/hardware/push`
3. Configurar el puerto `443` (HTTPS obligatorio).
4. El dispositivo aparecerá como **ONLINE** de inmediato en el panel de administración.
