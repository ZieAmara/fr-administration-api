import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { Association } from 'src/associations/association-table-db/association.entity';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { User } from 'src/users/user-table-db/user.entity';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociationDto } from './dto/association.dto';
import { QueryFailedError } from 'typeorm';
import { Member } from './dto/association.member';

@ApiTags('Associations Endpoints')
@Controller('association')
export class AssociationsController {

    constructor(
        private readonly associationService: AssociationsService,
    ) {}

    private async associationToAssociationDto(association: Association): Promise<AssociationDto> {
        const newAssociation = new AssociationDto();

        newAssociation.id = association.id;
        newAssociation.name = association.name;
        newAssociation.members = await this.usersToMembersDto(association.id, association.users);

        return newAssociation;

    }

    private async usersToMembersDto(idAssociatoion: number, users: User[]): Promise<Member[]> {
        return users.map(user => {
            const member = new Member();
            member.id = user.id;
            member.firstName = user.firstName;
            member.lastName = user.lastName;
            member.userName = user.userName;
            member.age = user.age;
            member.role = user.roles
                .map(role => (role.association.id === idAssociatoion) ? role.name : null)
                .filter(role => role !== null)
                .join(', ');
            return member;
        });
    }

    @ApiHeader({
        name: 'Create an association',
        description: 'This endpoint allows you to create an association.',
    })
    @Post('create')
    @ApiResponse({ status: 201, description: 'The association has been successfully created.' })
    @ApiResponse({ status: 400, description: 'The association has not been created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    public async createAssociation(@Body() createAssociationDto: CreateAssociationDto): Promise<AssociationDto> {
        let newAssociation = new AssociationDto();
        try {
            const associationCreated = await this.associationService.createAssociation(createAssociationDto);
            if (associationCreated) {
                newAssociation = await this.associationToAssociationDto(associationCreated);
            }
            return newAssociation;
        } catch (error) {
            console.log(error);
            if (error instanceof QueryFailedError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public async getAllAssociations(): Promise<AssociationDto[]> {
        try {
            const associations = await this.associationService.getAssociations();
            const allAssociationsDto = [];
            for (const association of associations) {
                allAssociationsDto.push(await this.associationToAssociationDto(association));
            }
            return allAssociationsDto
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public async getAssociationById(@Param('id', ParseIntPipe) id: number): Promise<AssociationDto> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return await this.associationToAssociationDto(association);
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
    public async getMembersOfAssociation(@Param('id', ParseIntPipe) id: number): Promise<Member[]> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        try {
            const users = await this.associationService.getMembersOfAssociation(id);
            const members = await this.usersToMembersDto(id, users);
            return members
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public async updateAssociation(@Param('id', ParseIntPipe) id: number, @Body() updateAssociationDto: UpdateAssociationDto): Promise<AssociationDto> {
        const associationUpdated = await this.associationService.updateAssociation(id, updateAssociationDto);
        if (!associationUpdated) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        try {
            return await this.associationToAssociationDto(associationUpdated);
        } catch (error) {
            console.log(error);
            throw new HttpException("The server encountered an unexpected condition that prevented it from fulfilling the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
