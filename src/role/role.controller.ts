import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role-table-db/role.entity';
import { QueryFailedError } from 'typeorm';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto } from './dto/role.dto';
import { RoleUserDto } from './dto/role.user';
import { RoleAssociationDto } from './dto/role.association';
import { Association } from 'src/associations/association-table-db/association.entity';
import { User } from 'src/users/user-table-db/user.entity';

@ApiTags('Roles Endpoints')
@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
    ) {}


    /**
     * DTO Mapping 
     * from Role to RoleDto
     * @param createRoleDto 
     * @returns Promise<RoleDto>
     */
    private async roleToRoleDto(role: Role): Promise<RoleDto> {
        const newRole = new RoleDto();
        newRole.id = role.id;
        newRole.name = role.name;
        newRole.user = await this.usersToRoleUsersDto(role.user);
        newRole.association = await this.associationsToRoleAssociationsDto(role.association);
        return newRole;
    }



    /**
     * DTO Mapping 
     * from User to RoleUserDto
     * @param user 
     * @returns Promise<RoleUserDto>
     */
    private async usersToRoleUsersDto(user: User): Promise<RoleUserDto> {
        const newUsers = new RoleUserDto();

        if (!user) {
            return newUsers;
        }

        newUsers.idUser = user.id;
        newUsers.firstName = user.firstName;
        newUsers.lastName = user.lastName;
        newUsers.userName = user.userName;
        newUsers.mail = user.mail;
        newUsers.age = user.age;

        return newUsers;
    }


    /**
     * DTO Mapping 
     * from Association to RoleAssociationDto
     * @param association 
     * @returns Promise<RoleAssociationDto>
     */
    private async associationsToRoleAssociationsDto(association: Association): Promise<RoleAssociationDto> {
        const newAssociation = new RoleAssociationDto();
        
        if (!association) {
            return newAssociation;
        }

        newAssociation.idAssociation = association.id;
        newAssociation.name = association.name;
        newAssociation.description = association.description;

        return newAssociation;
    }


    /**
     * Handle error
     * @param error 
     * @throws HttpException or QueryFailedError
     */
    private handleError(error: any) {
        if (error instanceof QueryFailedError) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
        if (error instanceof HttpException) {
            switch (error.getStatus()) {
                case HttpStatus.BAD_REQUEST:
                    throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
                case HttpStatus.CONFLICT:
                    throw new HttpException(error.message, HttpStatus.CONFLICT)
                case HttpStatus.FORBIDDEN:
                    throw new HttpException(error.message, HttpStatus.FORBIDDEN)
                case HttpStatus.NOT_FOUND:
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND)
                default:
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }


    @ApiHeader({
        name: 'Create an role',
        description: 'This endpoint allows you to create an role.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The role has been successfully created.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The role has not been created.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
        try {
            const roleCreated =await this.roleService.createRole(createRoleDto);
            return await this.roleToRoleDto(roleCreated);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get All roles',
        description: 'This endpoint allows you to get all roles.',
    })
    @Get('all')
    @ApiResponse({ status: HttpStatus.OK, description: 'The roles have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The roles have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAllRoles(): Promise<RoleDto[]> {
        try {
            const roles = await this.roleService.getAllRoles();
            const rolesDto: RoleDto[] = [];
            for (const role of roles) {
                rolesDto.push(await this.roleToRoleDto(role));
            }
            return rolesDto;
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get users with role name',
        description: 'This endpoint allows you to get all users with role name.',
    })
    @Get('users/:roleName')
    @ApiResponse({ status: HttpStatus.OK, description: 'The roles have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The roles have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getRolesByName(@Param('roleName') roleName: string): Promise<RoleUserDto[]> {
        try {
            const roles = await this.roleService.getRolesByName(roleName);
            const usersDto: RoleUserDto[] = [];
            for (const role of roles) {
                usersDto.push(await this.usersToRoleUsersDto(role.user));
            }
            return usersDto;
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get One role',
        description: 'This endpoint allows you to get one role.',
    })
    @Get(':idUser/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The role has not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getRoleByIdUserAndIdAssociation(@Param('idUser', ParseIntPipe) idUser: number, @Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<RoleDto> {
        try {
            const role = await this.roleService.getUserRoleByIdUserAndIdAssociation(idUser, idAssociation);
            return await this.roleToRoleDto(role);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Update an role',
        description: 'This endpoint allows you to update an role.',
    })
    @Put('update/:idUser/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully updated.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The role has not been updated.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async updateRoleByIdUserAndIdAssociation(@Param('idUser', ParseIntPipe) idUser: number, @Param('idAssociation', ParseIntPipe) idAssociation: number, @Body() newRole: UpdateRoleDto): Promise<RoleDto> {
        try {
            const role = await this.roleService.updateRoleByIdUserAndIdAssociation(idUser, idAssociation, newRole);
            return await this.roleToRoleDto(role);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Delete an role',
        description: 'This endpoint allows you to delete an role.',
    })
    @Delete('delete/:idUser/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The role has been successfully deleted.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The role has not been deleted.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async deleteRoleByIdUserAndIdAssociation(@Param('idUser', ParseIntPipe) idUser: number, @Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<boolean> {
        try {
            return await this.roleService.deleteRoleByIdUserAndIdAssociation(idUser, idAssociation);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }

}
