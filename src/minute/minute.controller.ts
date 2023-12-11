import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { MinuteService } from './minute.service';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { Minute } from './minute-table-db/minute.entity';
import { QueryFailedError } from 'typeorm';
import { UpdateMinuteDto } from './dto/update-minute.dto';
import { MinuteDto } from './dto/minute.dto';
import { MinuteVoterDto } from './dto/minute.voter';
import { User } from 'src/users/user-table-db/user.entity';
import { MinuteAssociationDto } from './dto/minute.association';
import { Association } from 'src/associations/association-table-db/association.entity';

@ApiTags('Minutes Endpoints')
@Controller('minute')
export class MinuteController {

    constructor(
        private readonly minuteService: MinuteService
    ) {}


    /**
     * DTO Mapping 
     * from Minute to MinuteDto
     * @param minute : Minute
     * @returns newMinute : MinuteDto
     */
    private async minuteToMinuteDto(minute: Minute): Promise<MinuteDto> {
        const newMinute = new MinuteDto();

        newMinute.id = minute.id;
        newMinute.content = minute.content;
        newMinute.date = minute.date;
        newMinute.association = await this.associationToMinuteAssociationDto(minute.association);
        newMinute.voters = await this.userToMinuteVoterDto(minute.voters);

        return newMinute;
    }


    /**
     * DTO Mapping 
     * from User to MinuteVoterDto
     * @param user : User
     * @returns newVoter : MinuteVoterDto
     */
    private async userToMinuteVoterDto(voters: User[]): Promise<MinuteVoterDto[]> {
        const newVoters: MinuteVoterDto[] = [];

        if (!voters || voters.length === 0) {
            return newVoters;
        }

        voters.forEach(user => {
            const voter = new MinuteVoterDto();

            voter.idUser = user.id;
            voter.firstName = user.firstName;
            voter.lastName = user.lastName;
            voter.userName = user.userName;
            voter.age = user.age;
            
            newVoters.push(voter);     
        });

        return newVoters;
    }


    /**
     * DTO Mapping 
     * from Association to MinuteAssociationDto
     * @param association : Association
     * @returns newAssociation : MinuteAssociationDto
     */
    private async associationToMinuteAssociationDto(association: Association): Promise<MinuteAssociationDto> {
        const newAssociation = new MinuteAssociationDto();

        if (!association) {
            return newAssociation;
        }

        newAssociation.idAssociation = association.id;
        newAssociation.name = association.name;

        return newAssociation;
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


    @ApiHeader({
        name: 'Create a minute',
        description: 'This endpoint allows you to create a minute.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The minute has been successfully created.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minute has not been created.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async createMinute(@Body() createMinuteDto: CreateMinuteDto): Promise<MinuteDto> {
       try {
           const newMinute = await this.minuteService.createMinute(createMinuteDto);
           return await this.minuteToMinuteDto(newMinute);
       } catch (error) {
           console.log(error);
           this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get All minutes',
        description: 'This endpoint allows you to get all minutes.',
    })
    @Get('all')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minutes have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minutes have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAllMinutes(): Promise<MinuteDto[]> {
        try {
            const minutes = await this.minuteService.getAllMinutes();
            const newMinutes: MinuteDto[] = [];
            for (const minute of minutes) {
                newMinutes.push(await this.minuteToMinuteDto(minute));
            }
            return newMinutes;
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get One minute',
        description: 'This endpoint allows you to get one minute.',
    })
    @Get(':idMinute')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minute has been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minute has not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getMinuteById(@Param('idMinute', ParseIntPipe) idMinute: number): Promise<MinuteDto> {
        try {
            const minute = await this.minuteService.getMinuteById(idMinute);
            return await this.minuteToMinuteDto(minute);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: "Get all association's minutes",
        description: "This endpoint allows you to get all association's minutes.",
    })
    @Get('association/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minutes have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minutes have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getMinuteByIdAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<MinuteDto[]> {
        try {
            const minutes = await this.minuteService.getMinuteByIdAssociation(idAssociation);
            const newMinutes: MinuteDto[] = [];
            for (const minute of minutes) {
                newMinutes.push(await this.minuteToMinuteDto(minute));
            }
            return newMinutes;
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Update a minute',
        description: 'This endpoint allows you to update a minute.',
    })
    @Put('update/:idMinute')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minute has been successfully updated.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minute has not been updated.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async updateMinute(@Param('idMinute', ParseIntPipe) idMinute: number, @Body() newMinute: UpdateMinuteDto): Promise<MinuteDto> {
        try {
            const minute = await this.minuteService.updateMinute(idMinute, newMinute);
            return await this.minuteToMinuteDto(minute);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Delete a minute',
        description: 'This endpoint allows you to delete a minute.',
    })
    @Delete('delete/:idMinute')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minute has been successfully deleted.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minute has not been deleted.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async deleteMinute(@Param('idMinute', ParseIntPipe) idMinute: number): Promise<boolean> {
        try {
            return await this.minuteService.deleteMinuteById(idMinute);
        } catch (error) {
            console.log(error);
            this.handleError(error);
        }
    }

}
