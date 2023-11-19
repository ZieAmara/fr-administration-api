import { Column, Entity } from "typeorm";

@Entity()
export class User {

    @Column({
        type: "int",
        primary: true,
        nullable: false
    })
    id: number;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    lastName: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    firstName: string;

    @Column({
        type: "int",
        nullable: false
    })
    age: number;

}