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
        const roleCreated = this.roleRepository.create({
            name: createRoleDto.name,
        });

        const user = await this.usersService.getUserById(createRoleDto.idUser);
        const association = await this.associationsService.getAssociationById(createRoleDto.idAssociation);
        roleCreated.user = user;
        roleCreated.association = association;

        await this.roleRepository.save(roleCreated);
        return roleCreated;
    }

    public async getAllRoles(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    public async getUserRoleByIdUserAndIdAssociation(idUser: number, idAssociation: number): Promise<Role> {
        return await this.roleRepository.findOne({
            where: {user: {id: idUser}, association: {id: idAssociation}}
        });
    }

    public async updateRoleByIdUserAndIdAssociation(idUser: number, idAssociation: number, newRole: UpdateRoleDto): Promise<Role> {
        const roleUpdated = this.roleRepository.findOne({
            where: {user: {id: idUser}, association: {id: idAssociation}}
        });
        if (!roleUpdated){
            throw new HttpException( `Role with idUser ${idUser} and idAssociation ${idAssociation} not found`, HttpStatus.NOT_FOUND);
        }
        if (newRole.name !== (await roleUpdated).name) {
            (await roleUpdated).name = newRole.name
            await this.roleRepository.save(await roleUpdated);
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
