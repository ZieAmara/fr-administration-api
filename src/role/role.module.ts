import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AssociationsModule } from '../associations/associations.module';
import { roleProviders } from './role-table-db/role.providers';

@Module({
  controllers: [RoleController],
  providers: [...roleProviders, RoleService],
  imports: [DatabaseModule, UsersModule, AssociationsModule]
})
export class RoleModule {}
