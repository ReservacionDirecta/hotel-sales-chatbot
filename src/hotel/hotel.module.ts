import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [PrismaModule],
  controllers: [HotelController, ConversationController],
  providers: [HotelService, ConversationService],
  exports: [HotelService, ConversationService],
})
export class HotelModule {}
