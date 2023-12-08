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
                entities: [__dirname + "/../**/*.entity{.ts,.js}"],
                synchronize: true,
                //logging: true
            });
            return dataSource.initialize()
                .then(() => {
                    console.log("Data Source has been initialized!");
                })
                .catch((err) => {
                    console.error("Error during Data Source initialization", err);
                })
            ;
        },
    },
];
