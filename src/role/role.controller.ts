import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role-table-db/role.entity';
import { QueryFailedError } from 'typeorm';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles Endpoints')
@Controller('role')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
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
    public async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        try {
            return await this.roleService.createRole(createRoleDto);
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async getAllRoles(): Promise<Role[]> {
        try {
            return await this.roleService.getAllRoles();
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async getRoleByIdUserAndIdAssociation(@Param('idUser', ParseIntPipe) idUser: number, @Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<Role> {
        try {
            return await this.roleService.getUserRoleByIdUserAndIdAssociation(idUser, idAssociation);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async updateRoleByIdUserAndIdAssociation(@Param('idUser', ParseIntPipe) idUser: number, @Param('idAssociation', ParseIntPipe) idAssociation: number, @Body() newRole: UpdateRoleDto): Promise<Role> {
        try {
            return await this.roleService.updateRoleByIdUserAndIdAssociation(idUser, idAssociation, newRole);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
