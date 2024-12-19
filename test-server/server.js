const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3002'], // Frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// Test endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

// Rooms endpoints
app.get('/api/hotel/rooms', (req, res) => {
  res.json([
    {
      id: 1,
      type: "Suite",
      price: 200,
      available: true,
      description: "Habitación de lujo con vista al mar"
    },
    {
      id: 2,
      type: "Estándar",
      price: 100,
      available: true,
      description: "Habitación confortable con todas las comodidades"
    }
  ]);
});

app.get('/api/hotel/rooms/available', (req, res) => {
  res.json([
    {
      id: 1,
      type: "Suite",
      price: 200,
      available: true,
      description: "Habitación de lujo con vista al mar"
    }
  ]);
});

// Conversations endpoints
app.get('/api/hotel/conversations', (req, res) => {
  res.json([
    {
      id: 1,
      userId: "user123",
      status: "active",
      messages: [
        {
          id: 1,
          sender: "client",
          content: "Hola, quisiera información sobre habitaciones",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          sender: "bot",
          content: "¡Bienvenido! Con gusto le ayudo con información sobre nuestras habitaciones.",
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Scripts endpoints
app.get('/api/hotel/scripts', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Saludo inicial",
      content: "¡Bienvenido a nuestro hotel! ¿En qué puedo ayudarle?",
      type: "greeting",
      active: true
    },
    {
      id: 2,
      name: "Información de habitaciones",
      content: "Tenemos diferentes tipos de habitaciones disponibles. ¿Le gustaría conocer más detalles?",
      type: "info",
      active: true
    }
  ]);
});

// Stats endpoint
app.get('/api/hotel/stats', (req, res) => {
  res.json({
    totalRooms: 20,
    availableRooms: 15,
    occupiedRooms: 5,
    totalConversations: 100,
    activeConversations: 3,
    completedConversations: 97,
    totalScripts: 5,
    activeScripts: 4
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/test');
  console.log('- GET /api/hotel/rooms');
  console.log('- GET /api/hotel/rooms/available');
  console.log('- GET /api/hotel/conversations');
  console.log('- GET /api/hotel/scripts');
  console.log('- GET /api/hotel/stats');
});
