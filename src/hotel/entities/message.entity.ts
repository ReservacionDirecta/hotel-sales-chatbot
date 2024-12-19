import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @Column('text')
  sender: 'user' | 'assistant';

  @Column('text')
  content: string;

  @Column('text')
  messageType: 'text' | 'image' | 'location' | 'video' | 'audio';

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation;
}
