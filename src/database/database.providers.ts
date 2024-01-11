import { DataSource } from "typeorm";

export const databaseProviders = [
    {
        provide: "DATA_SOURCE",
        useFactory: async () => {
            const dataSource = new DataSource({
                type: "mysql",
                host: "database",
                port: 3306,
                username: "zie",
                password: "12345678",
                database: "associations_admin_db",
                entities: ["dist/**/*.entity{.ts,.js}"],
                synchronize: true,
                //logging: true
            });
            try {
                await dataSource.initialize();
                console.log("Data Source has been initialized!");
            } catch (error) {
                console.error("Error during Data Source initialization", error);
            }

            return dataSource;
        },
    },
];
