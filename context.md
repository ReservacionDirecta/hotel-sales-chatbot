:dev# Hotel Sales Chatbot Context

## README.md
# 🏨 Hotel Sales Chatbot

## 📝 Descripción
Un chatbot de ventas inteligente para hoteles que integra WhatsApp como canal de comunicación y Google Gemini AI para generar respuestas contextuales y personalizadas.

## ✨ Características

### 🤖 Inteligencia Artificial
- Respuestas naturales y contextuales con Google Gemini AI
- Comprensión de consultas en lenguaje natural
- Personalización basada en el contexto del hotel
- Manejo inteligente de disponibilidad y reservas

### 💬 Comunicación
- Integración completa con WhatsApp Business API
- Gestión de conversaciones en tiempo real
- Historial de chat persistente
- Soporte para mensajes multimedia

### 🏢 Gestión Hotelera
- Información detallada de habitaciones y servicios
- Control de disponibilidad en tiempo real
- Gestión de tarifas y promociones
- Scripts de ventas personalizables

### ⚙️ Panel de Administración
- Dashboard intuitivo
- Estadísticas y análisis
- Gestión de configuraciones
- Control de acceso y seguridad

## 🛠️ Tecnologías

### Backend
- **Framework**: NestJS
- **Database**: Prisma + PostgreSQL
- **AI**: Google Gemini AI
- **Messaging**: WhatsApp Business API

### Frontend
- **Framework**: Next.js 14
- **UI**: React + TailwindCSS
- **State**: React Context + Hooks
- **API**: Axios + React Query

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 16
- npm o yarn
- Cuenta de Google AI Studio
- WhatsApp Business API configurada

### Instalación

1. **Clonar y Preparar**
   ```bash
   git clone https://github.com/yourusername/hotel-sales-chatbot.git
   cd hotel-sales-chatbot
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run migration:run
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Variables de Entorno**
   ```env
   # backend/.env
   DATABASE_URL=postgresql://user:password@localhost:5432/hotel_chatbot
   GEMINI_API_KEY=your_api_key_here

   # frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Ejecución

1. **Backend** (Puerto 3001)
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Frontend** (Puerto 3000)
   ```bash
   cd frontend
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
hotel-sales-chatbot/
├── backend/
│   ├── src/
│   │   ├── conversations/   # Módulo de conversaciones
│   │   ├── hotel/          # Módulo de hoteles
│   │   └── whatsapp/       # Módulo de integración WhatsApp
├── frontend/
│   ├── src/
│   │   ├── app/           # Páginas y rutas
│   │   └── components/    # Componentes React
```

## 🧪 Testing

### Backend
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage
```

### Frontend
```bash
npm run test        # Unit tests
npm run test:watch  # Watch mode
npm run cypress     # E2E tests
```

## 📚 Documentación

### API Endpoints
- `POST /conversations`: Crear nueva conversación
- `GET /conversations`: Listar conversaciones
- `POST /messages`: Enviar mensaje
- `GET /messages`: Obtener mensajes de una conversación
- Documentación completa en `/api/docs`

### Guías
- [Manual de Usuario](docs/user-guide.md)
- [Guía de Desarrollo](docs/dev-guide.md)
- [API Reference](docs/api-reference.md)

## 🤝 Contribución

1. Fork el repositorio
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones
- Commits: Conventional Commits
- Code Style: ESLint + Prettier
- Testing: Jest + React Testing Library

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md)

## 🙋‍♂️ Soporte
- GitHub Issues
- Email: support@example.com
- Discord: [Únete al servidor](https://discord.gg/example)

## 🌟 Agradecimientos
- Google AI Studio Team
- WhatsApp Business API Team
- Contribuidores de código abierto


## PENDING_AND_BUGS.md
# Hotel Sales Chatbot - Estado del Proyecto

## 🚀 Estado Actual

### Servicios Activos
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- API Base: `http://localhost:3001/api`

### Integraciones Completadas ✅
- Google Gemini AI para procesamiento de lenguaje natural
- WhatsApp Business API para mensajería
- SQLite para almacenamiento de datos
- Sistema de scripts de ventas personalizables

## 🐛 Registro de Bugs

### Bugs Activos
1. **Validación y Respuestas API**
   - [ ] Algunos endpoints devuelven formatos de respuesta inconsistentes
   - [ ] Necesario estandarizar según interfaz `ApiResponse<T>`
   - Prioridad: Alta
   - Impacto: Medio
   - Asignado a: Por asignar

### Bugs Resueltos ✅
1. **Persistencia de Datos**
   - [x] Pérdida de entrada de mensajes durante auto-refresh
   - [x] Estado de entrada preservado usando refs
   - [x] Implementadas actualizaciones optimistas
   - Resuelto en: v0.2.1

2. **Validación de Mensajes**
   - [x] Estandarización de nombres de campos
   - [x] Actualización de DTOs e interfaces
   - [x] Implementación de validación consistente
   - Resuelto en: v0.2.2

3. **Configuración WhatsApp**
   - [x] Eliminación de opción `takeoverMode` inválida
   - [x] Mejora en configuración de puppeteer
   - [x] Optimización de manejo de errores
   - Resuelto en: v0.2.3

4. **Variables de Entorno**
   - [x] Corrección de configuración de Gemini API
   - [x] Implementación de carga robusta de configuración
   - [x] Mejora en logging de variables de entorno
   - Resuelto en: v0.2.3

## 📋 Tareas Pendientes

### Prioridad Alta
1. **Seguridad**
   - [ ] Implementar rate limiting
   - [ ] Validación de requests
   - [ ] Rotación de API keys
   - Deadline: TBD

2. **Manejo de Errores**
   - [ ] Middleware de errores global
   - [ ] Logging estructurado
   - [ ] Monitoreo de errores
   - Deadline: TBD

### Prioridad Media
1. **Optimización**
   - [ ] Caché de respuestas AI
   - [ ] Compresión de respuestas
   - [ ] Optimización de queries
   - Deadline: TBD

2. **Frontend**
   - [ ] Estados de carga
   - [ ] Manejo de errores UI
   - [ ] Paginación de mensajes
   - Deadline: TBD

### Prioridad Baja
1. **Documentación**
   - [ ] Guía de integración Gemini
   - [ ] Documentación de API
   - [ ] Guía de deployment
   - Deadline: TBD

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
# Backend (.env)
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=your_api_key_here

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Dependencias Principales
```json
{
  "backend": {

## PENDING_AND_BUGS.md
... (insert contents of PENDING_AND_BUGS.md here)

## BUGS.md
# 🐛 Registro de Bugs

## Estado Actual (2024-12-14)

### ✅ Bugs Resueltos

1. **Incompatibilidad de Tipos de Datos**
   - **Descripción**: Error al usar tipos enum en SQLite/PostgreSQL
   - **Solución**: Cambiado a character varying con restricciones CHECK
   - **Archivos Afectados**:
     - `backend/src/conversations/entities/message.entity.ts`
     - `backend/src/hotel/entities/message.entity.ts`
     - `backend/src/conversations/entities/conversation.entity.ts`
     - `backend/src/hotel/entities/conversation.entity.ts`

2. **Errores de TypeScript en Decoradores**
   - **Descripción**: Error en la sintaxis del decorador @Column
   - **Solución**: Actualizada la sintaxis para pasar el tipo como primer argumento
   - **Ejemplo**: `@Column('character varying', { length: 20 })`

3. **Inconsistencia entre Módulos**
   - **Descripción**: Diferentes definiciones de entidades entre módulos
   - **Solución**: Unificadas las definiciones y estructura

### 🔍 Pendiente de Verificación

1. **Pruebas de Integración**
   - Validar el funcionamiento de las nuevas restricciones CHECK
   - Verificar la creación y actualización de registros
   - Probar la integración con el frontend

2. **Rendimiento**
   - Monitorear el rendimiento con los nuevos tipos de datos
   - Verificar tiempos de respuesta en consultas complejas

3. **Migraciones**
   - Confirmar que las migraciones se ejecutan correctamente
   - Verificar la integridad de datos existentes

### 📝 Notas para Desarrollo

1. **Convenciones de Código**
   - Usar `character varying` en lugar de `varchar`
   - Implementar restricciones CHECK para campos enumerados
   - Mantener consistencia en nombres de campos entre módulos

2. **Pruebas Recomendadas**
   ```typescript
   // Ejemplo de prueba para restricciones
   it('should validate sender type', async () => {
     const message = new Message();
     message.sender = 'invalid'; // Debería fallar
     await expect(message.save()).rejects.toThrow();
   });
   ```

## Historial de Versiones

### v1.1.0 (2024-12-14)
- ✅ Migración a tipos de datos PostgreSQL nativos
- ✅ Implementación de restricciones CHECK
- ✅ Unificación de entidades entre módulos
