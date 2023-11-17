import { Module } from '@nestjs/common';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AssociationsController],
  providers: [AssociationsService],
  imports: [UsersModule],
})
export class AssociationsModule {}
