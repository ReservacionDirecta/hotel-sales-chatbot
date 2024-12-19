import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  userId: string;

  @Column('text')
  whatsappId: string;

  @Column('text')
  status: 'active' | 'closed';

  @OneToMany(() => Message, (message) => message.conversation, { eager: true })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
