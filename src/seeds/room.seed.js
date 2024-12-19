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
exports.seedRooms = void 0;
const room_entity_1 = require("../entities/room.entity");
const seedRooms = (dataSource) => __awaiter(void 0, void 0, void 0, function* () {
    const roomRepository = dataSource.getRepository(room_entity_1.Room);
    // Check if rooms already exist
    const existingRooms = yield roomRepository.find();
    if (existingRooms.length > 0) {
        console.log('Rooms already seeded');
        return;
    }
    // Sample room data
    const rooms = [
        {
            name: 'Deluxe King Room',
            type: 'Deluxe',
            capacity: 2,
            price: 200.00,
            isAvailable: true,
            description: 'Spacious room with king-size bed and city view',
            amenities: ['King Bed', 'City View', 'Mini Bar', 'Wi-Fi']
        },
        {
            name: 'Standard Twin Room',
            type: 'Standard',
            capacity: 2,
            price: 150.00,
            isAvailable: true,
            description: 'Comfortable room with two twin beds',
            amenities: ['Twin Beds', 'Wi-Fi', 'TV']
        },
        {
            name: 'Executive Suite',
            type: 'Suite',
            capacity: 4,
            price: 350.00,
            isAvailable: true,
            description: 'Luxury suite with separate living area',
            amenities: ['King Bed', 'Living Room', 'Mini Bar', 'Wi-Fi', 'City View', 'Bathtub']
        }
    ];
    try {
        // Create rooms
        for (const roomData of rooms) {
            const room = roomRepository.create(roomData);
            yield roomRepository.save(room);
            console.log(`Created room: Type ${room.type} - Price $${room.price}`);
        }
        console.log('Rooms seeded successfully');
    }
    catch (error) {
        console.error('Error seeding rooms:', error);
        throw error;
    }
});
exports.seedRooms = seedRooms;
