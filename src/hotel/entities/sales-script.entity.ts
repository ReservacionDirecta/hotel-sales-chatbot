import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SalesScript {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  content: string;

  @Column()
  type: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
