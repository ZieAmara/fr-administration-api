import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociationDto } from './dto/association.dto';
import { Member } from './dto/association.member';
import { AssociationMinuteDto } from './dto/association.minute';
import { AssociationDtoMapping } from './dto/association.dto.mapping';

@ApiTags('Associations Endpoints')
@Controller('association')
export class AssociationsController {

    constructor(
        private readonly associationService: AssociationsService,
        private readonly associationDtoMapping: AssociationDtoMapping,
    ) {}


    @ApiHeader({
        name: 'Create an association',
        description: 'This endpoint allows you to create an association.',
    })
    @Post('create')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The association has been successfully created.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The association has not been created.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async createAssociation(@Body() createAssociationDto: CreateAssociationDto): Promise<AssociationDto> {
        try {
            const associationCreated = await this.associationService.createAssociation(createAssociationDto);
            return await this.associationDtoMapping.associationToAssociationDto(associationCreated);
        } catch (error) {
            console.log(error);
            this.associationDtoMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get All associations',
        description: 'This endpoint allows you to get all associations.',
    })
    @Get('all')
    @ApiResponse({ status: HttpStatus.OK, description: 'The associations have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The associations have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAllAssociations(): Promise<AssociationDto[]> {
        try {
            const allAssociationsDto: AssociationDto[] = [];
            const associations = await this.associationService.getAllAssociations();
            for (const association of associations) {
                allAssociationsDto.push(await this.associationDtoMapping.associationToAssociationDto(association));
            }
            return allAssociationsDto
        } catch (error) {
            console.log(error);
            this.associationDtoMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get One association',
        description: 'This endpoint allows you to get one association.',
    })
    @Get(':idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The association has been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The association has not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getAssociationById(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<AssociationDto> {
        const association = await this.associationService.getAssociationById(idAssociation);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${idAssociation}`, HttpStatus.NOT_FOUND)
        }
        return await this.associationDtoMapping.associationToAssociationDto(association);
    }


    @ApiHeader({
        name: 'Get association minutes',
        description: 'This endpoint allows you to get all minutes of an association.',
    })
    @Get(':idAssociation/minutes')
    @ApiResponse({ status: HttpStatus.OK, description: 'The minutes have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The minutes have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getMinutesOfAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<AssociationMinuteDto[]> {
        const association = await this.associationService.getAssociationById(idAssociation);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${idAssociation}`, HttpStatus.NOT_FOUND)
        }
        try {
            const minutes = await this.associationService.getMinutesOfAssociation(idAssociation);
            const newMinutes = await this.associationDtoMapping.minutesToAssociationMinutesDto(minutes);
            return newMinutes
        } catch (error) {
            console.log(error);
            this.associationDtoMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Get all Members of an Association',
        description: 'This endpoint allows you to get all members of an association.',
    })
    @Get(':idAssociation/members')
    @ApiResponse({ status: HttpStatus.OK, description: 'The members have been successfully retrieved.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The members have not been retrieved.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async getMembersOfAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<Member[]> {
        const association = await this.associationService.getAssociationById(idAssociation);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${idAssociation}`, HttpStatus.NOT_FOUND)
        }
        try {
            const users = await this.associationService.getMembersOfAssociation(idAssociation);
            const members = await this.associationDtoMapping.usersToMembersDto(idAssociation, users);
            return members
        } catch (error) {
            console.log(error);
            this.associationDtoMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Update an Association',
        description: 'This endpoint allows you to update an association.',
    })
    @Put('update/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The association has been successfully updated.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The association has not been updated.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async updateAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number, @Body() updateAssociationDto: UpdateAssociationDto): Promise<AssociationDto> {
        const associationUpdated = await this.associationService.updateAssociation(idAssociation, updateAssociationDto);
        if (!associationUpdated) {
            throw new HttpException(`Could not find a association with the id ${idAssociation}`, HttpStatus.NOT_FOUND)
        }
        try {
            return await this.associationDtoMapping.associationToAssociationDto(associationUpdated);
        } catch (error) {
            console.log(error);
            this.associationDtoMapping.handleError(error);
        }
    }


    @ApiHeader({
        name: 'Delete an Association',
        description: 'This endpoint allows you to delete an association.',
    })
    @Delete('delete/:idAssociation')
    @ApiResponse({ status: HttpStatus.OK, description: 'The association has been successfully deleted.'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The association has not been deleted.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Association not found.' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
    public async deleteAssociation(@Param('idAssociation', ParseIntPipe) idAssociation: number): Promise<boolean> {
        const associationDelated = await this.associationService.deleteAssociation(idAssociation);
        if (!associationDelated) {
            throw new HttpException(`Could not find a association with the id ${idAssociation}`, HttpStatus.NOT_FOUND)
        }
        return true;
    }

}
