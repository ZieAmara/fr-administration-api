import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { Association } from './interfaces/association.interface';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { User } from 'src/users/interfaces/user.interface';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Associations Endpoints')
@Controller('association')
export class AssociationsController {

    constructor(
        private readonly associationService: AssociationsService,
    ) {}


    @ApiHeader({
        name: 'Create an association',
        description: 'This endpoint allows you to create an association.',
    })
    @Post('create')
    @ApiResponse({ status: 201, description: 'The association has been successfully created.' })
    @ApiResponse({ status: 400, description: 'The association has not been created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createAssociation(@Body() createAssociationDto: CreateAssociationDto): Promise<Association> {
        return await this.associationService.create(createAssociationDto);
    }


    @ApiHeader({
        name: 'Get All associations',
        description: 'This endpoint allows you to get all associations.',
    })
    @Get('all')
    @ApiResponse({ status: 200, description: 'The associations have been successfully retrieved.'})
    @ApiResponse({ status: 400, description: 'The associations have not been retrieved.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAllAssociations(): Promise<Association[]> {
        return await this.associationService.getAssociations();
    }


    @ApiHeader({
        name: 'Get One association',
        description: 'This endpoint allows you to get one association.',
    })
    @Get(':id')
    @ApiResponse({ status: 200, description: 'The association has been successfully retrieved.'})
    @ApiResponse({ status: 400, description: 'The association has not been retrieved.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getAssociationById(@Param('id', ParseIntPipe) id: number): Promise<Association> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return association;
    }


    @ApiHeader({
        name: 'Get all Members of an Association',
        description: 'This endpoint allows you to get all members of an association.',
    })
    @Get(':id/members')
    @ApiResponse({ status: 200, description: 'The members have been successfully retrieved.'})
    @ApiResponse({ status: 400, description: 'The members have not been retrieved.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async getMembers(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return await this.associationService.getMembers(id);
    }


    @ApiHeader({
        name: 'Update an Association',
        description: 'This endpoint allows you to update an association.',
    })
    @Put('update/:id')
    @ApiResponse({ status: 200, description: 'The association has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'The association has not been updated.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async updateAssociation(@Param('id', ParseIntPipe) id: number, @Body() updateAssociationDto: UpdateAssociationDto): Promise<Association> {
        const associationUpdated = await this.associationService.updateAssociation(id, updateAssociationDto);
        if (!associationUpdated) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return associationUpdated;
    }


    @ApiHeader({
        name: 'Delete an Association',
        description: 'This endpoint allows you to delete an association.',
    })
    @Delete('delete/:id')
    @ApiResponse({ status: 200, description: 'The association has been successfully deleted.'})
    @ApiResponse({ status: 400, description: 'The association has not been deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Association not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async deleteAssociation(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        const associationDelated = await this.associationService.deleteAssociation(id);
        if (!associationDelated) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return true;
    }

}
