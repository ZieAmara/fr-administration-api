import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { DatabaseModule } from "../database/database.module";
import { messageProviders } from "./message-table-db/message.providers";
import { UsersModule } from "src/users/users.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    controllers: [MessageController],
    providers: [...messageProviders, MessageService],
    imports: [
        DatabaseModule, 
        UsersModule,
        ClientsModule.register([{
            name: 'RMQ_SERVICE', 
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://zie:123456@rabbitmq:5672/'],
              queue: 'fr_admin_message_queue',
              queueOptions: {
                durable: true,
              },
            },
        },]),
    ],
})
export class MessageModule {}