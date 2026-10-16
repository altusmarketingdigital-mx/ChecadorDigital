# Guía de Uso e Instalación: Versión Híbrida ALTUS en iPhone y iPad (iOS / iPadOS)

Esta guía describe cómo instalar y ejecutar **ALTUS Checador Digital** como una **Aplicación Híbrida (PWA Standalone)** en cualquier iPhone o iPad, ofreciendo una experiencia idéntica a una app nativa descargada de la App Store: pantalla completa, ícono personalizado, sin barras de navegación de navegador y con rendimiento optimizado.

---

## 1. Características de la Versión Híbrida en iOS / iPadOS

- **Modo Standalone (Pantalla Completa):** Al abrirse desde el ícono en la pantalla de inicio, la aplicación se ejecuta en su propia ventana sin la barra de direcciones ni la barra de herramientas de Safari.
- **Soporte de Dynamic Island y Notch:** Los márgenes superiores e inferiores se adaptan automáticamente con `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)` para que el contenido no quede oculto tras la cámara ni la barra de inicio.
- **Logotipo e Identidad ALTUS:** Ícono corporativo oficial en alta resolución (`#142238` Azul Marino con Terracota `#D95A3F`) configurado con `apple-touch-icon`.
- **Menú Lateral Adaptativo:** En iPhone se despliega mediante el botón hamburguesa, y en iPad se visualiza de forma fluida aprovechando el ancho de pantalla.
- **Service Worker Activo:** Gestión de caché y arranque instantáneo.

---

## 2. Paso a Paso: Cómo Instalar en iPhone o iPad

> **Requisito:** Debe realizarse desde el navegador **Safari** de Apple (es el único navegador en iOS con permisos del sistema para crear aplicaciones en la pantalla de inicio).

### Paso 1: Abrir el enlace en Safari
Abra **Safari** en su iPhone o iPad e ingrese a la dirección del sistema:
```text
https://checador-digital.vercel.app/login
```
*(o su dominio corporativo asignado)*.

### Paso 2: Tocar el botón "Compartir"
En la parte inferior de la pantalla del iPhone (o en la barra superior derecha en iPad), toque el icono de **Compartir** de Apple:
- Icono de un cuadrado con una flecha apuntando hacia arriba: `[ ↑ ]`.

### Paso 3: Seleccionar "Agregar a pantalla de inicio"
1. En la lista de opciones que se despliega, deslice hacia abajo.
2. Pulse la opción **"Agregar a pantalla de inicio"** (o *"Add to Home Screen"* si el dispositivo está en inglés), identificada con un icono de `[ + ]`.
3. Verá el nombre sugerido: **ALTUS Checador** y la previsualización del logotipo oficial.
4. Pulse **"Agregar"** en la esquina superior derecha.

### Paso 4: ¡Listo! Abrir la App
- Verá el ícono de **ALTUS Checador** directamente en su pantalla de inicio entre sus aplicaciones.
- Al tocarlo, se abrirá de inmediato en **pantalla completa** como una aplicación móvil independiente.

---

## 3. Aviso Inteligente Integrado en el Sistema

El sistema cuenta con un componente inteligente (`InstallPromptIOS.tsx`) que:
1. Detecta automáticamente si el usuario ingresa desde un iPhone o iPad.
2. Si aún no está instalada la versión de pantalla completa, muestra una tarjeta flotante en la parte inferior guiando al usuario paso a paso con flechas indicativas.
3. Una vez instalada y abierta como App, el aviso se desactiva automáticamente para brindar una experiencia 100% limpia.

---

## 4. Distribución Nativa Avanzada (Opcional con Capacitor)

Si en el futuro la empresa desea distribuir un archivo `.ipa` firmado mediante **Apple TestFlight**, **Apple Business Manager (MDM)** o la **App Store**, el proyecto está 100% preparado para empaquetarse con **Capacitor**:

```bash
# 1. En la carpeta platform/
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. Inicializar Capacitor
npx cap init "ALTUS Checador" "com.altus.checador" --web-dir out

# 3. Añadir plataforma iOS
npx cap add ios

# 4. Abrir en Xcode para compilar y firmar con certificado Apple Developer
npx cap open ios
```

---

*Desarrollado para ALTUS Checador Digital — 2026*
