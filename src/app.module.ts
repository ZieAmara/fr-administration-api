import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MinuteModule } from './minute/minute.module';

@Module({
  imports: [DatabaseModule, UsersModule, AssociationsModule, AuthModule, RoleModule, MinuteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
