import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
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