import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
    ) {}

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create({
            lastName: createUserDto.lastName, 
            firstName: createUserDto.firstName, 
            age: createUserDto.age,
            userName: createUserDto.userName,
            userPassword: await this.hashPassword(createUserDto.userPassword)
        });
        await this.userRepository.save(user);
        return user;
    }

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.userRepository.findOne({where: {id: userId}});
    }

    public async getUserByUserName(userName: string): Promise<User> {
        return await this.userRepository.findOne({where: {userName: userName}});
    }

    public async updateUser(userId: number, updateUserDto): Promise<User> {
        const user = this.userRepository.findOne({where: {id: userId}});
        if (await user) {
            if (updateUserDto.lastName) {
                (await user).lastName = updateUserDto.lastName;
            }
            if (updateUserDto.firstName) {
                (await user).firstName = updateUserDto.firstName;
            }
            if (updateUserDto.age) {
                (await user).age = updateUserDto.age > 0 ? updateUserDto.age : 0;
            }
            if (updateUserDto.userName) {
                (await user).userName = updateUserDto.userName;
            }
            if (updateUserDto.userPassword) {
                (await user).userPassword = updateUserDto.userPassword;
            }

            await this.userRepository.save(await user);
            return this.userRepository.findOne({where: {id: userId}});
        }
        return null;
    }

    public async deleteUser(userId: number): Promise<boolean> {
        const user = this.userRepository.findOne({where: {id: userId}});
        if (await user) {
            this.userRepository.delete(userId);
            return true;    
        }
        return false;
    }
}
