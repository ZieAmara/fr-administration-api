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
        nullable: false
    })
    userPassword: string;

    @OneToMany(() => Role, role => role.user)
    roles?: Role[];

}

/* SQL Command to create this table
CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, lastName VARCHAR(100) NOT NULL, firstName VARCHAR(100) NOT NULL, age INT NOT NULL, userName VARCHAR(100) NOT NULL UNIQUE, userPassword VARCHAR(100) NOT NULL);
*/