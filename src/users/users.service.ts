import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { Role } from 'src/role/role-table-db/role.entity';
import { Association } from 'src/associations/association-table-db/association.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
            mail: createUserDto.mail,
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
        return await this.userRepository.find({
            relations: ['roles']
        });
    }


    public async getUserById(idUser: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id: idUser},
            relations: ['roles']
        });
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND)
        }
        return user;
    }


    public async getUserRolesById(idUser: number): Promise<Role[]> {
        const user = await this.userRepository.findOne({
            where: {id: idUser},
            relations: ['roles']
        });
        if (!user) {
            throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND)
        }
        return user.roles;
    }


    public async getUserByUserName(userName: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {userName: userName},
            relations: ['roles']
        });
        if (!user) {
            throw new HttpException(`Could not find a user with the username ${userName}`, HttpStatus.NOT_FOUND)
        }
        return user;
    }


    public async getUserAssociations(userName: string): Promise<Association[]> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('user.associations', 'associations')
            .leftJoinAndSelect('associations.users', 'association_users')
            .where('user.userName = :userName OR user.mail = :userName', { userName })
            .getOne();
            
        if (!user) {
            throw new HttpException(`Could not find a user with the username ${userName}`, HttpStatus.NOT_FOUND)
        }
        return user.associations;
    }


    public async updateUser(idUser: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = this.userRepository.findOne({where: {id: idUser}});
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
            if (updateUserDto.mail) {
                (await user).mail = updateUserDto.mail;
            }
            if (updateUserDto.userPassword) {
                (await user).userPassword = await this.hashPassword(updateUserDto.userPassword);
            }

            await this.userRepository.save(await user);
            return this.userRepository.findOne({
                where: {id: idUser},
                relations: ['roles']
            });
        }
        return null;
    }


    public async deleteUser(idUser: number): Promise<boolean> {
        const user = this.userRepository.findOne({where: {id: idUser}});
        if (await user) {
            this.userRepository.delete(idUser);
            return true;    
        }
        return false;
    }
}
