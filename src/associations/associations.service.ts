import { Injectable } from '@nestjs/common';
import { Association } from 'src/associations/interfaces/association.interface';
import { CreateAssociationDto } from 'src/associations/dto/create-association.dto';
import { UpdateAssociationDto } from 'src/associations/dto/update-association.dto';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AssociationsService {

    private readonly associations = [
        { id: 0, idUsers: [0, 1 , 2], name: 'association 0'},
        { id: 1, idUsers: [1, 3 , 4], name: 'association 1'},
    ]

    constructor(
        private readonly usersService: UsersService
    ) {}

    public async create(createAssociationDto: CreateAssociationDto): Promise<Association> {
        const associationCreated: Association = {} as Association;
        associationCreated.id = this.associations.length;
        let idUsersValide = [];
        createAssociationDto.idUsers.forEach(id => {
            const user = this.usersService.getUserById(id);
            if (user) {
                idUsersValide.push(id);
            }
        });
        associationCreated.idUsers = idUsersValide;
        associationCreated.name = createAssociationDto.name;
        this.associations.push(associationCreated);
        return associationCreated;
    }

    public async getAssociations(): Promise<Association[]> {
        return await this.associations;
    }

    public async getAssociationById(associationId: number): Promise<Association> {
        return await this.associations.filter(association => association.id === associationId)[0];
    }

    public async getMembers(associationId: number): Promise<User[]> {
        const association = await this.associations.filter(association => association.id === associationId)[0];
        const members = []
        let index = 0;
        let id = association.idUsers[index];
        while (id) {
            const user = await this.usersService.getUserById(association.idUsers[id]);
            members.push(user);
            id = association.idUsers[++index];
        }
        return members;
    }

    public async updateAssociation(associationId: number, association: UpdateAssociationDto): Promise<Association> {
        const associationUpdated: Association = this.associations.filter(association => association.id === associationId)[0];
        if (!association.idUsers) {
            associationUpdated.idUsers = association.idUsers
        }
        if (!association.name) {
            associationUpdated.name = association.name
        }
        return associationUpdated;
    }

    public async deleteAssociation(associationId: number): Promise<boolean> {
        const associationDelated = this.associations.filter(association => association.id === associationId)[0];
        if (!associationDelated) {
            return false;
        }
        this.associations.splice(associationId, 1);
        return true;
    }

}
