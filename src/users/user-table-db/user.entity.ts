import { Role } from "../../role/role-table-db/role.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
        unique: true,
    })
    mail: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false
    })
    userPassword: string;

    @OneToMany(() => Role, role => role.user, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    roles: Role[];

}
