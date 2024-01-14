import { User } from "../../users/user-table-db/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn,  } from "typeorm";

@Entity()
export class Message {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    mailExpeditor: string

    @Column()
    object: string

    @Column()
    content: string

    @ManyToMany(() => User, user => user.messages)
    @JoinTable({
        name: 'message_users',
        joinColumn: {
            name: 'messageId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    })
    usersDestinataires: User[]
}