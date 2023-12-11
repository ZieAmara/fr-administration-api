import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AssociationsService } from '../associations/associations.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Role } from './role-table-db/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {

    constructor(
        @Inject('ROLE_REPOSITORY')
        private readonly roleRepository: Repository<Role>,
        private readonly usersService: UsersService,
        private readonly associationsService: AssociationsService,
    ) {}


    public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const user = await this.usersService.getUserById(createRoleDto.idUser);
        const association = await this.associationsService.getAssociationById(createRoleDto.idAssociation);
        
        if (!user || !association) {
            throw new HttpException( 'User or association not found', HttpStatus.NOT_FOUND);
        }

        const roleCreated = this.roleRepository.create({
            name: createRoleDto.name,
            user: user,
            association: association
        });
        await this.roleRepository.save(roleCreated);

        return roleCreated;
    }


    public async getAllRoles(): Promise<Role[]> {
        return await this.roleRepository.find();
    }


    public async getRolesByName(name: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: {name: name}
        });
    }
    

    public async getUserRoleByIdUserAndIdAssociation(idUser: number, idAssociation: number): Promise<Role> {
        return await this.roleRepository.findOne({
            where: {user: {id: idUser}, association: {id: idAssociation}}
        });
    }


    public async updateRoleByIdUserAndIdAssociation(idUser: number, idAssociation: number, newRole: UpdateRoleDto): Promise<Role> {
        const roleToUpdated = this.roleRepository.findOne({
            where: {user: {id: idUser}, association: {id: idAssociation}}
        });
        if (!roleToUpdated){
            throw new HttpException( `Role with idUser ${idUser} and idAssociation ${idAssociation} not found`, HttpStatus.NOT_FOUND);
        }
        if (newRole.name !== (await roleToUpdated).name) {
            (await roleToUpdated).name = newRole.name
            await this.roleRepository.save(await roleToUpdated);
        }
        return this.roleRepository.findOne({
            where: {user: {id: idUser}, association: {id: idAssociation}}
        });
    }


    public async deleteRoleByIdUserAndIdAssociation(idUser: number, idAssociation: number): Promise<boolean> {
        const role = await this.roleRepository.findOne({where: {user: {id: idUser}, association: {id: idAssociation}}});
        if (!role) {
            throw new HttpException( `Role with idUser ${idUser} and idAssociation ${idAssociation} not found`, HttpStatus.NOT_FOUND);
        }
        await this.roleRepository.delete(role);
        return true;
    }

}
