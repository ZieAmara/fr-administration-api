import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { Association } from './interfaces/association.interface';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { User } from 'src/users/interfaces/user.interface';

@Controller('association')
export class AssociationsController {

    constructor(
        private readonly associationService: AssociationsService,
    ) {}

    @Post('create')
    public async createAssociation(@Body() createAssociationDto: CreateAssociationDto): Promise<Association> {
        return await this.associationService.create(createAssociationDto);
    }

    @Get('all')
    public async getAllAssociations(): Promise<Association[]> {
        return await this.associationService.getAssociations();
    }

    @Get(':id')
    public async getAssociationById(@Param('id', ParseIntPipe) id: number): Promise<Association> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return association;
    }

    @Get(':id/members')
    public async getMembers(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
        const association = await this.associationService.getAssociationById(id);
        if (!association) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return await this.associationService.getMembers(id);
    }

    @Put('update/:id')
    public async updateAssociation(@Param('id', ParseIntPipe) id: number, @Body() updateAssociationDto: UpdateAssociationDto): Promise<Association> {
        const associationUpdated = await this.associationService.updateAssociation(id, updateAssociationDto);
        if (!associationUpdated) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return associationUpdated;
    }

    @Delete('delete/:id')
    public async deleteAssociation(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        const associationDelated = await this.associationService.deleteAssociation(id);
        if (!associationDelated) {
            throw new HttpException(`Could not find a association with the id ${id}`, HttpStatus.NOT_FOUND)
        }
        return true;
    }

}
