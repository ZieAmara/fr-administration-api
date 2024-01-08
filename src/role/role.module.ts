import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AssociationsModule } from '../associations/associations.module';
import { roleProviders } from './role-table-db/role.providers';
import { RoleDTOMapping } from './dto/role.dto.mapping';

@Module({
  controllers: [RoleController],
  providers: [...roleProviders, RoleService, RoleDTOMapping],
  imports: [DatabaseModule, UsersModule, AssociationsModule]
})
export class RoleModule {}
