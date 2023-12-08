import { Role } from "./role.entity";

export const roleProviders = [
    {
        provide: 'ROLE_REPOSITORY',
        useFactory: (connection) => connection.getRepository(Role),
        inject: ['DATA_SOURCE'],
    },
]