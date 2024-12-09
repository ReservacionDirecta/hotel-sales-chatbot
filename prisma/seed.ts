import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Peña Linda Bungalows',
      description: 'Hermosos bungalows con vista al mar en la mejor ubicación',
      rooms: {
        create: [
          {
            type: 'Bungalow Familiar',
            price: 250.00,
            description: 'Bungalow espacioso para 4-6 personas con vista al mar',
            available: true
          },
          {
            type: 'Bungalow Romántico',
            price: 180.00,
            description: 'Bungalow íntimo para 2 personas con jacuzzi',
            available: true
          },
          {
            type: 'Bungalow Estándar',
            price: 150.00,
            description: 'Bungalow confortable para 2-3 personas',
            available: true
          }
        ]
      }
    }
  });

  // Create sales scripts
  const scripts = await prisma.salesScript.createMany({
    data: [
      {
        name: 'Saludo Inicial',
        type: 'greeting',
        content: '¡Hola! 👋 Bienvenido a Peña Linda Bungalows. Soy tu asistente virtual y estoy aquí para ayudarte a encontrar el bungalow perfecto para tu estadía. ¿En qué fechas te gustaría visitarnos? 🌴✨',
        active: true
      },
      {
        name: 'Presentación Familiar',
        type: 'presentation',
        content: 'Nuestro Bungalow Familiar es perfecto para ti y tu familia. Con espacio para 4-6 personas, una hermosa vista al mar y todas las comodidades que necesitas. ¿Te gustaría ver algunas fotos? 📸',
        active: true
      },
      {
        name: 'Manejo de Precio',
        type: 'objection',
        content: 'Entiendo tu preocupación por el precio. Actualmente tenemos una promoción especial: 15% de descuento en estadías de 3 noches o más. Además, incluimos el desayuno buffet. ¿Te gustaría conocer más detalles? 💰✨',
        active: true
      },
      {
        name: 'Cierre de Venta',
        type: 'closing',
        content: '¡Excelente elección! Para asegurar tu reserva, solo necesitamos un depósito del 20%. ¿Te gustaría proceder con la reserva ahora? Tenemos disponibilidad inmediata para las fechas que mencionaste. 🎉',
        active: true
      }
    ]
  });

  // Create default settings
  const settings = await prisma.settings.create({
    data: {
      currency: 'USD',
      language: 'es',
      timeZone: 'America/Lima',
      welcomeMessage: '¡Bienvenido a Peña Linda Bungalows! ¿En qué podemos ayudarte?',
      businessName: 'Peña Linda Bungalows',
      businessHours: '09:00-18:00',
      notificationEmail: 'info@penalinda.com'
    }
  });

  console.log({ hotel, scripts, settings });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
