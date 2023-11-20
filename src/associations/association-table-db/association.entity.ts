import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user-table-db/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Association {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'json',
        nullable: false
    })
    idUsers: number[];

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @JoinTable()
    users: Promise<User[]>;

}