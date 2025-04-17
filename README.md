# Sistema de Mantenimiento Industrial

Sistema integral para la gestión de mantenimiento industrial y control de combustible, compuesto por una aplicación móvil para trabajadores y una plataforma web para administradores y clientes.

## 🏗️ Estructura del Proyecto

```
├── Backend/           # API REST en Node.js/Express
├── Frontend/          # Aplicación Web (React)
├── Mobile/           # Aplicación Móvil (React Native)
└── db/               # Scripts y esquemas de base de datos
```

## 🚀 Características Principales

### Módulo de Mantenimiento
- Registro de mantenimientos preventivos y correctivos
- Seguimiento de equipos por cliente
- Generación de informes en PDF
- Historial de mantenimientos por equipo

### Módulo de Combustible
- Registro de recargas de combustible
- Control de kilometraje
- Seguimiento de consumo
- Generación de reportes

### Gestión de Usuarios
- Sistema de autenticación y autorización
- Roles diferenciados (Trabajadores, Administradores, Clientes)
- Historial personal de actividades

## 👥 Roles de Usuario

### Trabajadores
- Registro de mantenimientos vía app móvil
- Registro de recargas de combustible
- Captura de datos de vehículos

### Administradores
- Gestión de usuarios
- Consulta de reportes
- Generación de informes PDF
- Dashboard de métricas

### Clientes
- Consulta de servicios realizados
- Descarga de informes
- Seguimiento de equipos

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, MySQL
- **Frontend Web**: React, Material-UI
- **Frontend Móvil**: React Native
- **Base de Datos**: MySQL (Clevercloud)
- **Autenticación**: JWT

## 🚀 Instalación

### Requisitos Previos
- Node.js (v18 o superior)
- MySQL
- React Native CLI (para desarrollo móvil)

### Configuración del Backend
```bash
cd Backend
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### Configuración del Frontend Web
```bash
cd Frontend
npm install
npm start
```

### Configuración de la App Móvil
```bash
cd Mobile
npm install
npx react-native run-android # o run-ios
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 