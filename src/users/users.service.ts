import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user-table-db/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
    ) {}

    public async createUser(lastName: string, firstName: string, age: number): Promise<User> {
        const id = (await this.userRepository.find()).length;
        const user = this.userRepository.create({
            id: id, 
            lastName: lastName, 
            firstName: 
            firstName, 
            age: age>0? age : 0
        });
        await this.userRepository.save(user);
        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.userRepository.findOne({where: {id: userId}});
    }

    public async updateUser(userId: number, updateUserDto): Promise<User> {
        const user = this.userRepository.findOne({where: {id: userId}});
        if (user) {
            if (updateUserDto.lastName) {
                (await user).lastName = updateUserDto.lastName;
            }
            if (updateUserDto.firstName) {
                (await user).firstName = updateUserDto.firstName;
            }
            if (updateUserDto.age) {
                (await user).age = updateUserDto.age > 0 ? updateUserDto.age : 0;
            }

            await this.userRepository.save(await user);
            return this.userRepository.findOne({where: {id: userId}});
        }
        return null;
    }

    public async deleteUser(userId: number): Promise<boolean> {
        const user = this.userRepository.findOne({where: {id: userId}});
        if (user) {
            this.userRepository.delete(userId);
            await this.updateUsersIDs();
            return true;    
        }
        return false;
    }

    private async updateUsersIDs(): Promise<void> {
        await this.userRepository.query(`SET @counter = 0;`);
        await this.userRepository.query(`UPDATE user SET id = @counter := @counter + 1 WHERE id > 0;`);
    }

}
