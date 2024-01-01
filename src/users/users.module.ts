import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userProviders } from './user-table-db/user.providers';
import { DatabaseModule } from '../database/database.module';
import { UserDTOMapping } from './dto/user.dto.mapping';

@Module({
  controllers: [UsersController],
  providers: [...userProviders, UsersService, UserDTOMapping],
  exports: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
