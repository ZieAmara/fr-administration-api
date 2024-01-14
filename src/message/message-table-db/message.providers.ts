import { Message } from "./message.entity";

export const messageProviders = [
    {
        provide: 'MESSAGES_REPOSITORY',
        useFactory: (connection) => connection.getRepository(Message),
        inject: ['DATA_SOURCE'],
    },
]