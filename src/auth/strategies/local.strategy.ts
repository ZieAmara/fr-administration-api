import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"; 
import { AuthService } from "../auth.service";
import { LogInDto } from "../dto/log-in.dto";
import { UserValidedDto } from "src/users/dto/valided-user.dto";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const logInDto : LogInDto = {
            userName: username,
            userPassword: password
        }
        const user: UserValidedDto = await this.authService.validateUser(logInDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}