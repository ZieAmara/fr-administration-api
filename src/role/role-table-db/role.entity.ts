import { Association } from "../../associations/association-table-db/association.entity";
import { User } from "../../users/user-table-db/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @ManyToOne(() => Association, association => association.roles, {
        eager: true,
        nullable: false
    })
    association: Association;

    @ManyToOne(() => User, user => user.roles, {
        eager: true,
        nullable: false
    })
    user: User;

}