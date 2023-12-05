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
    @JoinTable()
    Users: User[];

    @OneToMany(() => Role, role => role.association)
    roles?: Role[];
    
}

/* SQL Command to create this table
CREATE TABLE association (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, Users JSON NOT NULL);
*/