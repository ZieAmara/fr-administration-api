import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MinuteController } from './minute.controller';
import { MinuteService } from './minute.service';
import { DatabaseModule } from '../database/database.module';
import { AssociationsModule } from '../associations/associations.module';
import { minuteProviders } from './minute-table-db/minute.providers';

@Module({
  controllers: [MinuteController],
  providers: [...minuteProviders, MinuteService],
  imports: [DatabaseModule, AssociationsModule, UsersModule],
})
export class MinuteModule {}
