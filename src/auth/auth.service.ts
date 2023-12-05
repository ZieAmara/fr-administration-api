import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LogInDto } from './dto/log-in.dto';
import { UserValidedDto } from '../users/dto/valided-user.dto';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    public async validateUser(logInDto: LogInDto) : Promise<UserValidedDto>{
        const user = await this.usersService.getUserByUserName(logInDto.userName);
        if (!user) {
            throw new UnauthorizedException();
        } else {
            const isMatch = await bcrypt.compare(logInDto.userPassword, user.userPassword);
            if (!isMatch) {
            throw new UnauthorizedException();}
        }
        const { userPassword, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { userName: user.userName, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}

