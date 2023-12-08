import { Role } from "../../role/role-table-db/role.entity";
import { User } from "../../users/user-table-db/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Association {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'association_users',
        joinColumn: {
            name: 'associationId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    Users: User[];

    @OneToMany(() => Role, role => role.association, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    roles: Role[];
    
}
