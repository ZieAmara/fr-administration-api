import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserValidedDto } from './dto/valided-user.dto';
import { QueryFailedError } from 'typeorm';

@ApiTags('Users Endpoints')
@Controller('user')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ){}


    @ApiHeader({
        name: 'Create an User',
        description: 'This endpoint allows you to create an user.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created.' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'The user has not created. Because of Duplicate entry userName'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The user has not been created. because some user fields are missing' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<UserValidedDto> {
        try {
            return await this.usersService.createUser(createUserDto);
        } catch (error) {
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
    @ApiResponse({ status: 400, description: 'The users have not been retrieved.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAllUsers(): Promise<User[]> {
        return await this.usersService.getAllUsers();
    }


    @ApiHeader({
        name: 'Get One User',
        description: 'This endpoint allows you to get one user.',
    })
    @Get(':id')
    @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.'})
    @ApiResponse({ status: 400, description: 'The user has not been retrieved.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.usersService.getUserById(id);
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return user;
    }


    @ApiHeader({
        name: 'Update an User',
        description: 'This endpoint allows you to update an user fields.',
    })
    @Put('update/:id')
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'The user has not been updated.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersService.updateUser(id, updateUserDto);
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return user ;
    }


    @ApiHeader({
        name: 'Delete an User',
        description: 'This endpoint allows you to delete an user.',
    })
    @Delete('delete/:id')
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.'})
    @ApiResponse({ status: 400, description: 'The user has not been deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        const userDelated = await this.usersService.deleteUser(id);
        if (!userDelated) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return true;
    }

}
