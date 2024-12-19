import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hotel-info')
export class HotelInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column('json')
  amenities: string[];

  @Column('json')
  policies: { [key: string]: string };
}
