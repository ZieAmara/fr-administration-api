import { Inject, Injectable } from '@nestjs/common';
import { Association } from 'src/associations/interfaces/association.interface';
import { CreateAssociationDto } from 'src/associations/dto/create-association.dto';
import { UpdateAssociationDto } from 'src/associations/dto/update-association.dto';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AssociationsService {

    constructor(
        @Inject('ASSOCIATIONS_REPOSITORY')
        private readonly associationsRepository: Repository<Association>,
        private readonly usersService: UsersService
    ) {}

    public async create(createAssociationDto: CreateAssociationDto): Promise<Association> {
        const associationCreated = this.associationsRepository.create({
            name: createAssociationDto.name
        });
        const idUsersValide = await Promise.all(
            createAssociationDto.idUsers.map(async (idUser) => {
                const user = await this.usersService.getUserById(+idUser);
                return user? +idUser : null;
            })
        )
        associationCreated.idUsers = idUsersValide.filter(id => id !== null);
        await this.associationsRepository.save(associationCreated);
        return associationCreated;
    }

    public async getAssociations(): Promise<Association[]> {
        return await this.associationsRepository.find();
    }

    public async getAssociationById(associationId: number): Promise<Association> {
        return await this.associationsRepository.findOne({where: {id: associationId}});
    }

    public async getMembers(associationId: number): Promise<User[]> {
        const association = await this.associationsRepository.findOne({where: {id: associationId}});
        const members = await Promise.all(
            association.idUsers.map(async (idUser) => {
                const user = await this.usersService.getUserById(+idUser);
                return user;
            })
        );
        return members;
    }

    public async updateAssociation(associationId: number, association: UpdateAssociationDto): Promise<Association> {
        const associationUpdated = this.associationsRepository.findOne({where: {id: associationId}});
        if (await associationUpdated) {
            if (association.idUsers) {
                const idUsersValide = await Promise.all(
                    association.idUsers.map(async (idUser) => {
                        const user = await this.usersService.getUserById(+idUser);
                        return user? +idUser : null;
                    })
                );
                (await associationUpdated).idUsers = idUsersValide.filter(id => id !== null);
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
