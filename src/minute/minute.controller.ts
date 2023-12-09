import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { MinuteService } from './minute.service';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { Minute } from './minute-table-db/minute.entity';
import { QueryFailedError } from 'typeorm';
import { UpdateMinuteDto } from './dto/update-minute.dto';

@ApiTags('Minutes Endpoints')
@Controller('minute')
export class MinuteController {

    constructor(
        private readonly minuteService: MinuteService
    ) {}

    @ApiHeader({
        name: 'Create a minute',
        description: 'This endpoint allows you to create a minute.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The minute has been successfully created.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minute has not been created.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async createMinute(@Body() createMinuteDto: CreateMinuteDto): Promise<Minute> {
       try {
        return await this.minuteService.createMinute(createMinuteDto);
       } catch (error) {
           console.log(error);
           if (error instanceof QueryFailedError) {
               throw new HttpException(error.message, HttpStatus.CONFLICT);
           }
           throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async getAllMinutes(): Promise<Minute[]> {
        try {
            return await this.minuteService.getAllMinutes();
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async getMinuteById(@Param('idMinute', ParseIntPipe) idMinute: number): Promise<Minute> {
        try {
            return await this.minuteService.getMinuteById(idMinute);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async getMinuteByIdAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<Minute[]> {
        try {
            return await this.minuteService.getMinuteByIdAssociation(idAssociation);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
    public async updateMinute(@Param('idMinute', ParseIntPipe) idMinute: number, @Body() newMinute: UpdateMinuteDto): Promise<Minute> {
        try {
            return await this.minuteService.updateMinute(idMinute, newMinute);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
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
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
