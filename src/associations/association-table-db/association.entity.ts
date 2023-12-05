import { User } from "src/users/user-table-db/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Association {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User)
    @JoinTable()
    @Column({
        type: 'json',
        nullable: false
    })
    Users: User[];

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;
    
}

/* SQL Command to create this table
CREATE TABLE association (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, Users JSON NOT NULL);
*/