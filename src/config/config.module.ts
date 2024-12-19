import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigController } from './config.controller';
import { AIConfigService } from './ai.service';
import aiConfig from './ai.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [aiConfig],
      isGlobal: true,
    }),
  ],
  controllers: [ConfigController],
  providers: [AIConfigService],
  exports: [AIConfigService],
})
export class ConfigModule {}
