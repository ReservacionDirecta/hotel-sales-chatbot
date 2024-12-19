import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { Hotel } from '../entities/hotel.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>
  ) { }

  async onApplicationBootstrap() {
    await this.seedHotelAndRooms();
  }

  private async seedHotelAndRooms() {
    const hotelCount = await this.hotelRepository.count();
    if (hotelCount === 0) {
      try {
        // Create hotel first
        const hotel = await this.hotelRepository.save({
          name: 'Hotel Cascade',
          description: 'A luxurious hotel offering comfort and elegance'
        });

        // Create rooms associated with the hotel
        const rooms = [
          {
            type: 'Suite Presidencial',
            price: 500.00,
            description: 'Lujosa suite con vista panorámica, sala de estar y jacuzzi privado',
            available: true,
            hotelId: hotel.id,
            number: '101'
          },
          {
            type: 'Suite Ejecutiva',
            price: 300.00,
            description: 'Elegante suite con área de trabajo y sala de estar',
            available: true,
            hotelId: hotel.id,
            number: '102'
          },
          {
            type: 'Habitación Deluxe',
            price: 200.00,
            description: 'Espaciosa habitación con cama king-size y vista a la ciudad',
            available: true,
            hotelId: hotel.id,
            number: '103'
          },
          {
            type: 'Habitación Superior',
            price: 150.00,
            description: 'Confortable habitación con dos camas queen-size',
            available: true,
            hotelId: hotel.id,
            number: '104'
          },
          {
            type: 'Habitación Estándar',
            price: 100.00,
            description: 'Acogedora habitación con todas las comodidades básicas',
            available: true,
            hotelId: hotel.id,
            number: '105'
          }
        ];

        await this.roomRepository.save(rooms);
        console.log('Hotel and rooms seeded successfully');
      } catch (error) {
        console.error('Error seeding hotel and rooms:', error);
      }
    }
  }
}
