import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ){}

    @Post('create')
    public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService.createUser(createUserDto.lastName, createUserDto.firstName, createUserDto.age);    
    }

    @Get('all')
    public async getAllUsers(): Promise<User[]> {
        return await this.usersService.getAllUsers();
    }
    
    @Get(':id')
    public async getUserById(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.getUserById(parseInt(id));
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return user;
    }

    @Put('update/:id')
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersService.updateUser(id, updateUserDto);
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return user;
    }


    @Delete('delete/:id')
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        const userDelated = await this.usersService.deleteUser(id);
        if (!userDelated) {
            throw new HttpException(`Could not find a user with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return true;
    }

}
