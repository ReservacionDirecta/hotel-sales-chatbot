# 🏨 Hotel Sales Chatbot - Documentación Técnica

## �요 Descripción General del Proyecto

El Hotel Sales Chatbot es una solución integral de inteligencia artificial diseñada para optimizar las ventas y la comunicación en el sector hotelero. Utilizando tecnologías de vanguardia, el proyecto permite a los hoteles interactuar con clientes potenciales de manera inteligente, personalizada y eficiente a través de WhatsApp.

## 🎯 Objetivos Principales

1. **Automatización de Ventas**: Generar respuestas contextuales y personalizadas para consultas de clientes.
2. **Comunicación Multicanal**: Integración fluida con WhatsApp Business API.
3. **Gestión Inteligente**: Proporcionar información detallada sobre habitaciones, servicios y disponibilidad.

## 🏗️ Estructura del Proyecto

### Directorios Principales

```
hotel-sales-chatbot/
│
├── backend/               # Lógica de servidor y API
│   ├── src/
│   │   ├── main.ts        # Punto de entrada del servidor
│   │   ├── conversations/ # Controladores de conversaciones
│   │   └── ...
│
├── frontend/              # Interfaz de usuario
│   ├── src/
│   │   ├── app/           # Rutas y componentes de Next.js
│   │   └── services/      # Servicios de API y utilidades
│
├── prisma/                # Configuración de base de datos
│   └── schema.prisma      # Definición del modelo de datos
│
├── docs/                  # Documentación del proyecto
├── test-server/           # Configuraciones de prueba
└── .env                   # Variables de entorno
```

## 🛠️ Arquitectura Técnica

### Backend
- **Framework**: NestJS
- **Base de Datos**: Prisma ORM con PostgreSQL
- **Inteligencia Artificial**: Google Gemini AI
- **Mensajería**: WhatsApp Business API

### Frontend
- **Framework**: Next.js 14
- **Interfaz de Usuario**: React + TailwindCSS
- **Gestión de Estado**: React Context y Hooks
- **Comunicación API**: Axios y React Query

## 🌟 Características Principales

### Inteligencia Artificial
- Generación de respuestas naturales y contextuales
- Comprensión avanzada de lenguaje natural
- Personalización basada en contexto hotelero

### Comunicación
- Integración completa con WhatsApp
- Gestión de conversaciones en tiempo real
- Soporte para mensajes multimedia
- Historial de chat persistente

### Gestión Hotelera
- Información detallada de habitaciones
- Control de disponibilidad en tiempo real
- Gestión de tarifas y promociones
- Scripts de ventas personalizables

### Panel de Administración
- Dashboard intuitivo
- Estadísticas y análisis
- Gestión de configuraciones
- Control de acceso y seguridad

## 🚀 Flujo de Trabajo

1. Cliente envía mensaje por WhatsApp
2. Webhook captura la comunicación
3. Gemini AI procesa el mensaje
4. Sistema genera respuesta contextual
5. Respuesta se envía por WhatsApp
6. Conversación se almacena en base de datos

## 🔒 Consideraciones de Seguridad

- Autenticación basada en tokens
- Cifrado de comunicaciones
- Gestión segura de credenciales
- Validación de entrada de datos

## 📈 Escalabilidad y Rendimiento

- Arquitectura de microservicios
- Caché de respuestas frecuentes
- Procesamiento asíncrono
- Tolerancia a fallos

## 🔍 Próximos Pasos

- Mejora de modelos de IA
- Integración con más canales
- Análisis predictivo de ventas
- Personalización más profunda

## 📋 Requisitos

- Node.js >= 16
- npm o yarn
- Cuenta de Google AI Studio
- Credenciales de WhatsApp Business

## 🤝 Contribución

Por favor, lee CONTRIBUTING.md para detalles sobre nuestro código de conducta y proceso de contribución.

## 📄 Licencia

Este proyecto está bajo [INSERTAR TIPO DE LICENCIA]. Consulta el archivo LICENSE para más detalles.
