import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'The user has not been created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.createUser(createUserDto);    
    }


    @ApiHeader({
        name: 'Get All Users',
        description: 'This endpoint allows you to get all users.',
    })
    @Get('all')
    @ApiResponse({ status: 200, description: 'The users have been successfully retrieved.'})
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
