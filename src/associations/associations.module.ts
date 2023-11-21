import { Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { associationProviders } from './association-table-db/association.providers';

@Module({
  controllers: [AssociationsController],
  providers: [...associationProviders, AssociationsService],
  imports: [DatabaseModule, UsersModule],
})
export class AssociationsModule {}
