import { Inject, Injectable } from '@nestjs/common';
import { Association } from '../associations/association-table-db/association.entity';
import { CreateAssociationDto } from '../associations/dto/create-association.dto';
import { UpdateAssociationDto } from '../associations/dto/update-association.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { User } from '../users/user-table-db/user.entity';

@Injectable()
export class AssociationsService {

    constructor(
        @Inject('ASSOCIATIONS_REPOSITORY')
        private readonly associationsRepository: Repository<Association>,
        private readonly usersService: UsersService
    ) {}

    public async createAssociation(createAssociationDto: CreateAssociationDto): Promise<Association> {
        const associationCreated = this.associationsRepository.create({
            name: createAssociationDto.name
        });
        const users = await Promise.all(
            createAssociationDto.idUsers.map(async (idUser) => {
                const user = await this.usersService.getUserById(+idUser);
                return user? user : null;
            })
        )
        associationCreated.users = users.filter(user => user !== null);
        await this.associationsRepository.save(associationCreated);
        return associationCreated;
    }

    public async getAssociations(): Promise<Association[]> {
        return await this.associationsRepository.find();
    }

    public async getAssociationById(associationId: number): Promise<Association> {
        return await this.associationsRepository.findOne({where: {id: associationId}});
    }

    public async getMembersOfAssociation(associationId: number): Promise<User[]> {
        const association = await this.associationsRepository.findOne({where: {id: associationId}});
        return association.users;
    }

    public async updateAssociation(associationId: number, association: UpdateAssociationDto): Promise<Association> {
        const associationUpdated = this.associationsRepository.findOne({where: {id: associationId}});
        if (await associationUpdated) {
            if (association.idUsers) {
                const users = await Promise.all(
                    association.idUsers.map(async (idUser) => {
                        const user = await this.usersService.getUserById(+idUser);
                        return user? user : null;
                    })
                );
                (await associationUpdated).users = users.filter(user => user !== null);
            }
            if (association.name) {
                (await associationUpdated).name = association.name
            }

            await this.associationsRepository.save(await associationUpdated);
            return this.associationsRepository.findOne({where: {id: associationId}});
        }
        return null;
    }

    public async deleteAssociation(associationId: number): Promise<boolean> {
        const association = this.associationsRepository.findOne({where: {id: associationId}});
        if (await association) {
            this.associationsRepository.delete(associationId);
            return true;
        }
        return false;    
    }

}
