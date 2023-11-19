import { DataSource } from "typeorm";

export const databaseProviders = [
    {
        provide: "DATA_SOURCE",
        useFactory: async () => {
            const dataSource = new DataSource({
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "zie",
                password: "12345678",
                database: "associations_admin_db",
                entities: ["dist/**/*.entity{.ts,.js}"],
                synchronize: true,
            });
            return dataSource.initialize();
        },
    },
];
