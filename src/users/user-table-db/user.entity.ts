import { Message } from "src/message/message-table-db/message.entity";
import { Association } from "../../associations/association-table-db/association.entity";
import { Role } from "../../role/role-table-db/role.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
        unique: true
    })
    userName: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    mail: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    userPassword: string;


    @ManyToMany(() => Association, association => association.users)
    associations: Association[];

    @OneToMany(() => Role, role => role.user, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    roles: Role[];

    @OneToMany(() => Message, message => message.usersDestinataires, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    messages: Message[];
}
