import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./message-table-db/message.entity";
import { UsersService } from "src/users/users.service";
import { CreateMessageDto } from "./dto/create-message.dto";


@Injectable()
export class MessageService {
    
    constructor(
        @Inject('MESSAGES_REPOSITORY')
        private readonly messageRepository: Repository<Message>,
        private readonly usersService: UsersService,
    ) {}


    public async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        const messageCreated = this.messageRepository.create({
            mailExpeditor: createMessageDto.mailExpeditor,
            object: createMessageDto.object,
            content: createMessageDto.content
        });

        const users = await Promise.all(
            createMessageDto.idUsersDestinataires.map(async (idUser) => {
                const user = await this.usersService.getUserById(idUser);
                if (!user) {
                    throw new Error('User not found');
                }
                return user? user : null;
            })
        )

        messageCreated.usersDestinataires = users.filter(user => user !== null);
        
        return await this.messageRepository.save(messageCreated);
    }


    public async getAllMessages(): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            relations: ['usersDestinataires']
        });
        return messages;
    }


    public async getMessageById(messageId: number): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: {id: messageId},
            relations: ['usersDestinataires']
        });
        return message;
    }


    public async sendMessage(messageId: number): Promise<Message> {
        const message = await this.getMessageById(messageId);
        if (!message) {
            throw new Error('Message not found');
        }
        return await this.messageRepository.save(message);
    }

}