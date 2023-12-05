import { Module } from '@nestjs/common';
import { MinuteController } from './minute.controller';
import { MinuteService } from './minute.service';

@Module({
  controllers: [MinuteController],
  providers: [MinuteService]
})
export class MinuteModule {}
