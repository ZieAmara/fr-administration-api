import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {

    private readonly users: User[] = [
        { id: 0, lastName: "Doe", firstName: "John", age: 30},
        { id: 1, lastName: "Kim", firstName: "Albet", age: 17},
        { id: 2, lastName: "Sow", firstName: "Ali", age: 24},
        { id: 3, lastName: "Tre", firstName: "Andre", age: 9},
        { id: 4, lastName: "Doe", firstName: "Jack", age: 48},
    ]

    public async createUser(lastName: string, firstName: string, age: number): Promise<User> {
        const user: User = {} as User;
        user.id = this.users.length;
        user.lastName = lastName;
        user.firstName = firstName;
        (age > 0)? user.age = age : user.age = 0;
        this.users.push(user);
        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.users;
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.users.filter(user => user.id === userId)[0];
    }

    public async updateUser(userId: number, updateUserDto): Promise<User> {
        const user = this.users.filter(user => user.id === userId)[0];
        if (updateUserDto.lastName) {
            user.lastName = updateUserDto.lastName;
        }
        if (updateUserDto.firstName) {
            user.firstName = updateUserDto.firstName;
        }
        if (updateUserDto.age) {
            user.age = updateUserDto.age;
        }
        this.users[userId] = user;
        return this.users[userId];
    }

    public async deleteUser(userId: number): Promise<boolean> {
        const user = this.users.filter(user => user.id === userId)[0];
        if (!user) {
            return false;
        }
        this.users.splice(userId, 1)[0];
        return true;
    }

}
