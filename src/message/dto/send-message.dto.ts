import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {

    @ApiProperty({
        type: String,
        description: 'Message expeditor is name of this message',
        example: "expeditor@example.com",
    })
    mailExpeditor: string;

    @ApiProperty({
        type: [Number],
        description: 'Users destinataires of this message',
        example: "destinataire1@example.com, destinataire2@example.com",
    })
    mailsDestinataires: string[];

    @ApiProperty({
        type: String,
        description: 'Object of this message',
        example: "Meeting",
    })
    object: string;

    @ApiProperty({
        type: String,
        description: 'Content of this message',
        example: "we have a meeting on 30/01/2000 at 10:00 am to discuss something important for the community",
    })
    content: string;
}