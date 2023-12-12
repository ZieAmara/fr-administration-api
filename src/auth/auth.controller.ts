import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-Auth.guard';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogInDto } from './dto/log-in.dto';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from './guards/jwt.guard';

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
    public async logIn(@Body() logInDto: LogInDto): Promise<any> {
        try {
            return this.authService.logIn(logInDto);
        } catch (error) {
            this.handleError(error);
        }
    }


    /**
     * Handle error
     * @param error 
     * @throws HttpException or QueryFailedError
     */
    private handleError(error: any) {
        if (error instanceof QueryFailedError) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
        if (error instanceof HttpException) {
            switch (error.getStatus()) {
                case HttpStatus.BAD_REQUEST:
                    throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
                case HttpStatus.CONFLICT:
                    throw new HttpException(error.message, HttpStatus.CONFLICT)
                case HttpStatus.FORBIDDEN:
                    throw new HttpException(error.message, HttpStatus.FORBIDDEN)
                case HttpStatus.NOT_FOUND:
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND)
                default:
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}
