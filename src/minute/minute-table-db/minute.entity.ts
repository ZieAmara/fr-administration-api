import { Association } from "../../associations/association-table-db/association.entity";
import { User } from "../../users/user-table-db/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Minute {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public content: string;

    @Column()
    public date: string;

    @ManyToMany(() => User)
    public voters: User[];
    
    @ManyToOne(() => Association, (association) => association.minutes, {
        nullable: false
    })
    public association: Association;

}