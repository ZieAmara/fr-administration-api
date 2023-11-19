import { Association } from "./association.entity";

export const associationProviders = [
    {
        provide: 'ASSOCIATIONS_REPOSITORY',
        useFactory: (connection) => connection.getRepository(Association),
        inject: ['DATA_SOURCE'],
    },
]