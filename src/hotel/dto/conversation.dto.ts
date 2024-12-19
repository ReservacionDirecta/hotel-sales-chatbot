import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content!: string;

  @IsEnum(['user', 'assistant'])
  @IsOptional()
  sender?: 'user' | 'assistant' = 'user';

  @IsEnum(['text', 'image', 'location', 'video', 'audio'])
  @IsOptional()
  messageType?: 'text' | 'image' | 'location' | 'video' | 'audio' = 'text';

  @IsOptional()
  timestamp?: Date;
}

export class CreateConversationDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsOptional()
  whatsappId?: string;
}

export class UpdateConversationDto {
  @IsEnum(['active', 'closed', 'archived'])
  status!: 'active' | 'closed' | 'archived';
}
