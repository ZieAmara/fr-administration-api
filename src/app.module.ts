import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MinuteModule } from './minute/minute.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    DatabaseModule, 
    UsersModule, 
    AssociationsModule, 
    AuthModule, 
    RoleModule, 
    MinuteModule, 
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
