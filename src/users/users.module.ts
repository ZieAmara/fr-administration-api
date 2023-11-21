import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userProviders } from './user-table-db/user.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [UsersController],
  providers: [...userProviders, UsersService],
  exports: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
