import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"; 
import { AuthService } from "../auth.service";
import { LogInDto } from "../dto/log-in.dto";

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const logInDto = {
            userName: username,
            userPassword: password
        }
        const user: any = await this.authService.validateUser(logInDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}