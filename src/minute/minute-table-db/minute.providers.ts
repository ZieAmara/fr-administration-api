import { DataSource } from "typeorm";
import { Minute } from "./minute.entity";

export const minuteProviders = [
    {
        provide: 'MINUTE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Minute),
        inject: ['DATA_SOURCE'],
    },
];