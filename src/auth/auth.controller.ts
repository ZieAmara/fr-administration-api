import { Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-Auth.guard';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @ApiHeader({
        name: 'User Login',
        description: 'This endpoint allows you to logged an user.',
    })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiResponse({ status: HttpStatus.OK, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'The user has not been logged in.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async logIn(@Request() request): Promise<any> {
        return this.authService.login(request.user);
    }
}
