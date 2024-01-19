import { Body, Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { SendMessageDto } from "./dto/send-message.dto";
import { Message } from "./message-table-db/message.entity";
import { ApiHeader, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageDto } from "./dto/message.dto";
import { ClientProxy } from "@nestjs/microservices";


@ApiTags('Message Endpoint')
@Controller('message')
export class MessageController {

    constructor(
        @Inject('RMQ_SERVICE')
        private readonly rabbitMQClient: ClientProxy,
        private readonly messageService: MessageService,
    ) {}


    @ApiHeader({
        name: 'Create and send a message',
        description: 'This endpoint allows you to create and send a message.',
    })
    @Post('send-message')
    @ApiResponse({ status: HttpStatus.OK, description: 'The message has been successfully sent.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The message has not been sent.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async sendMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageDto> {
        const messageCreated = await this.messageService.createMessage(createMessageDto);

        const message: SendMessageDto = {
            mailExpeditor: messageCreated.mailExpeditor,
            object: messageCreated.object,
            content: messageCreated.content,
            mailsDestinataires: messageCreated.usersDestinataires.map(user => user.mail),
        }

        const messageDto: MessageDto = {
            id: messageCreated.id,
            mailExpeditor: message.mailExpeditor,
            object: message.object,
            content: message.content,
            mailsDestinataires: message.mailsDestinataires
        }

        try {
            this.rabbitMQClient.emit('send-message', message);
            return messageDto;
        } catch (error) {
            console.log(error);
        }
    }



    @ApiHeader({
        name: 'Get all messages',
        description: 'This endpoint allows you to get all messages.',
    })
    @Get('all-messages')
    @ApiResponse({ status: HttpStatus.OK, description: 'The messages have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The messages have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAllMessages(): Promise<MessageDto[]> {
        const messages = await this.messageService.getAllMessages();
        const messagesDto: MessageDto[] = [];

        for (const message of messages) {
            messagesDto.push({
                id: message.id,
                mailExpeditor: message.mailExpeditor,
                object: message.object,
                content: message.content,
                mailsDestinataires: message.usersDestinataires.map(user => user.mail),
            })
        }

        return messagesDto;
    }


    @ApiHeader({
        name: 'Get a message by id',
        description: 'This endpoint allows you to get a message by id.',
    })
    @Get('message-by-id/:messageId')
    @ApiResponse({ status: HttpStatus.OK, description: 'The message has been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The message has not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getMessageById(@Param('messageId', ParseIntPipe) messageId: number): Promise<Message> {
        const message = await this.messageService.getMessageById(messageId);
        return message;
    }


    @ApiHeader({
        name:'Send a message by id',
        description: 'This endpoint allows you to send a message by id.',
    })
    @Get('send-message-by-id/:messageId')
    @ApiResponse({ status: HttpStatus.OK, description: 'The message has been successfully sent.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The message has not been sent.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async sendMessageById(@Param('messageId', ParseIntPipe) messageId: number): Promise<boolean> {
        const message = await this.messageService.getMessageById(messageId);

        const messageDto: SendMessageDto = {
            mailExpeditor: message.mailExpeditor,
            object: message.object,
            content: message.content,
            mailsDestinataires: message.usersDestinataires.map(user => user.mail),
        }

        try {
            this.rabbitMQClient.emit('send-message', messageDto);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}