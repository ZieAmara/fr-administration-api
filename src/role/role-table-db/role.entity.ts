import { Association } from "../../associations/association-table-db/association.entity";
import { User } from "../../users/user-table-db/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Association, association => association.roles)
    association: Association;

    @ManyToOne(() => User, user => user.roles)
    user: User;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;
}