import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto } from './dto/role.dto';
import { RoleUserDto } from './dto/role.user';
import { RoleDTOMapping } from './dto/role.dto.mapping';

@ApiTags('Roles Endpoints')
@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
        private readonly rolesDTOMapping: RoleDTOMapping,
    ) {}

    
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
            return await this.rolesDTOMapping.roleToRoleDto(roleCreated);
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
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
                rolesDto.push(await this.rolesDTOMapping.roleToRoleDto(role));
            }
            return rolesDto;
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get One role',
        description: 'This endpoint allows you to get one role.',
    })
    @Get(':idRole')
    @ApiResponse({ status: HttpStatus.OK, description: 'The roles have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The roles have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getRoleById(@Param('idRole', ParseIntPipe) idRole: number): Promise<RoleDto> {
        try {
            const role = await this.roleService.getRoleById(idRole);
            return await this.rolesDTOMapping.roleToRoleDto(role);
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
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
                usersDto.push(await this.rolesDTOMapping.usersToRoleUsersDto(role.user));
            }
            return usersDto;
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
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
            return await this.rolesDTOMapping.roleToRoleDto(role);
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
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
            return await this.rolesDTOMapping.roleToRoleDto(role);
        } catch (error) {
            console.log(error);
            this.rolesDTOMapping.handleError(error);
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
            this.rolesDTOMapping.handleError(error);
        }
    }

}
