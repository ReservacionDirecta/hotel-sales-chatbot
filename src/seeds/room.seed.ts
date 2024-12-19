import { Room } from '../entities/room.entity';
import { DataSource } from 'typeorm';

export const seedRooms = async (dataSource: DataSource) => {
  const roomRepository = dataSource.getRepository(Room);

  // Check if rooms already exist
  const existingRooms = await roomRepository.find();
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
      await roomRepository.save(room);
      console.log(`Created room: Type ${room.type} - Price $${room.price}`);
    }
    console.log('Rooms seeded successfully');
  } catch (error) {
    console.error('Error seeding rooms:', error);
    throw error;
  }
};
