import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryFailedError } from 'typeorm';
import { Role } from 'src/role/role-table-db/role.entity';
import { UserDto } from './dto/user.dto';
import { UserRole } from './dto/user.role';

@ApiTags('Users Endpoints')
@Controller('user')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ){}


    /**
     * DTO Mapping 
     * from User to UserDto
     * @param user : User
     * @returns newUser : UserDto
     */
    private async userToUserDto(user: User): Promise<UserDto> {
        const newUser = new UserDto();

        newUser.id = user.id;
        newUser.lastName = user.lastName;
        newUser.firstName = user.firstName;
        newUser.userName = user.userName;
        newUser.age = user.age;
        newUser.roles = await this.rolesToRolesDto(user.roles);

        return newUser;
    }


    /**
     * DTO Mapping 
     * from Role to UserRole
     * @param idUser : number
     * @param roles : Role[]
     * @returns Promise<UserRole[]>
     */
private async rolesToRolesDto(roles: Role[]): Promise<UserRole[]> {
        const newRoles: UserRole[] = [];

        if (!roles || roles.length === 0) {
            return newRoles;
        }

        roles.forEach(role => {
            const newRole = new UserRole();
            newRole.id = role.id;
            newRole.idAssociation = role.association.id;
            newRole.name = role.name;
            newRoles.push(newRole);
        });

        return newRoles; 
    }


    @ApiHeader({
        name: 'Create an User',
        description: 'This endpoint allows you to create an user.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created.' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'The user has not created. Because of Duplicate entry userName'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The user has not been created. because some user fields are missing' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<UserDto> {
        let newUser = new UserDto()
        try {
            const userCreated = await this.usersService.createUser(createUserDto);
            if (userCreated) {
                newUser = await this.userToUserDto(userCreated);
            }
            return newUser;
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiHeader({
        name: 'Get All Users',
        description: 'This endpoint allows you to get all users.',
    })
    // @UseGuards(JwtAuthGuard)
    @Get('all')
    @ApiResponse({ status: HttpStatus.OK, description: 'The users have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The users have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAllUsers(): Promise<UserDto[]> {
        try {
            const allUsersDto: UserDto[] = [];
            const users = await this.usersService.getAllUsers();
            for (const user of users) {
                allUsersDto.push(await this.userToUserDto(user));
            }
            return allUsersDto;
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiHeader({
        name: 'Get One User',
        description: 'This endpoint allows you to get one user.',
    })
    @Get(':idUser')
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The user has not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getUserById(@Param('idUser', ParseIntPipe) idUser: number): Promise<UserDto> {
        try {
            const user = await this.usersService.getUserById(idUser);
            if (user) {
                return await this.userToUserDto(user);
            }
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiHeader({
        name: 'Get the role of an User',
        description: 'This endpoint allows you to get the roles of an user.',
    })
    @Get(':idUser/roles')
    @ApiResponse({ status: HttpStatus.OK, description: 'The roles have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The roles have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getUserRolesById(@Param('idUser', ParseIntPipe) idUser: number): Promise<UserRole[]> {
        try {
            const userRoles = await this.usersService.getUserRolesById(idUser);
            if (userRoles) {
                return await this.rolesToRolesDto(userRoles);
            }
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiHeader({
        name: 'Update an User',
        description: 'This endpoint allows you to update an user fields.',
    })
    @Put('update/:idUser')
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully updated.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The user has not been updated.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async updateUser(@Param('idUser', ParseIntPipe) idUser: number, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
        try {
            const userUpdated = await this.usersService.updateUser(idUser, updateUserDto);
            if (userUpdated === null) {
                throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND)
            }
            return this.userToUserDto(userUpdated);
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            if (error instanceof HttpException) {
                switch (error.getStatus()) {
                    case HttpStatus.NOT_FOUND:
                        throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND)
                    case HttpStatus.CONFLICT:
                        throw new HttpException(error.message, HttpStatus.CONFLICT)
                    case HttpStatus.FORBIDDEN:
                        throw new HttpException(error.message, HttpStatus.FORBIDDEN)
                    default:
                        throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }


    @ApiHeader({
        name: 'Delete an User',
        description: 'This endpoint allows you to delete an user.',
    })
    @Delete('delete/:idUser')
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully deleted.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The user has not been deleted.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async deleteUser(@Param('idUser', ParseIntPipe) idUser: number): Promise<boolean> {
        try {
            const userDelated = await this.usersService.deleteUser(idUser);
            if (!userDelated) {
                throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND)
            }
            return true;
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
