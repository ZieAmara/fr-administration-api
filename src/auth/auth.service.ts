import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SingInDto } from './dto/sing-in.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
    ) {}

    public async singIn(singInDto: SingInDto): Promise<any> {

        const user = await this.usersService.getUserByUserName(singInDto.userName);
        if (user?.userPassword !== singInDto.userPassword) {
            throw UnauthorizedException;
        }

        const { userPassword, ...result } = user;
        return result;
    }

}

