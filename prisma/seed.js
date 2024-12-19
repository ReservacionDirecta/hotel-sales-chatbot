"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create hotel
        const hotel = yield prisma.hotel.create({
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
        // Create hotel info for Gemini AI
        const hotelInfo = yield prisma.hotelInfo.create({
            data: {
                name: 'Peña Linda Bungalows',
                description: 'Peña Linda Bungalows es un exclusivo resort frente al mar que ofrece una experiencia única de alojamiento en bungalows privados. Cada unidad está diseñada para brindar el máximo confort y una vista espectacular al océano.',
                location: 'Playa Peña Linda, Km 42 Panamericana Sur, Perú',
                amenities: JSON.stringify([
                    'Piscina infinity con vista al mar',
                    'Restaurante gourmet',
                    'Bar de playa',
                    'Spa y centro de bienestar',
                    'Acceso directo a la playa',
                    'WiFi gratuito',
                    'Estacionamiento privado',
                    'Servicio a la habitación 24/7'
                ]),
                policies: JSON.stringify({
                    checkIn: 'A partir de las 15:00',
                    checkOut: 'Hasta las 11:00',
                    cancelacion: 'Cancelación gratuita hasta 48 horas antes',
                    mascotas: 'Se permiten mascotas pequeñas con cargo adicional',
                    niños: 'Los niños son bienvenidos. Cunas disponibles sin cargo',
                    pago: 'Aceptamos todas las tarjetas principales y efectivo'
                }),
                checkInTime: '15:00',
                checkOutTime: '11:00',
                contactPhone: '+51 123 456 789',
                contactEmail: 'reservas@penalinda.com'
            }
        });
        console.log('Created hotel info:', hotelInfo);
        // Create sales scripts
        const scripts = yield prisma.salesScript.createMany({
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
        const settings = yield prisma.settings.create({
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
        console.log({ hotel, scripts, settings, hotelInfo });
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
