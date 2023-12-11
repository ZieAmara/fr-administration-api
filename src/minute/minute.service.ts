import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Minute } from './minute-table-db/minute.entity';
import { AssociationsService } from '../associations/associations.service';
import { UsersService } from '../users/users.service';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { UpdateMinuteDto } from './dto/update-minute.dto';

@Injectable()
export class MinuteService {

    constructor(
        @Inject('MINUTE_REPOSITORY')
        private readonly minuteRepository: Repository<Minute>,
        private readonly associationService: AssociationsService,
        private readonly usersService: UsersService
    ) {}

    public async createMinute(createMinuteDto: CreateMinuteDto): Promise<Minute> {
        const association = await this.associationService.getAssociationById(createMinuteDto.idAssocation);
        const users = await Promise.all(
            createMinuteDto.idVoters.map(async (idVoter) => {
                const user = await this.usersService.getUserById(+idVoter);
                return user? user : null;
            })
        )
        const voters = users.filter(user => user !== null);

        if (!association || voters.length === 0) {
            throw new HttpException( 'Association or voters not found', HttpStatus.NOT_FOUND);
        }
        
        const minuteCreated = this.minuteRepository.create({
            content: createMinuteDto.content,
            date: createMinuteDto.date,
            voters: voters,
            association: association
        })
        return;
    }


    public async getAllMinutes(): Promise<Minute[]> {
        return await this.minuteRepository.find();
    }


    public async getMinuteById(idMinute: number): Promise<Minute> {
        return await this.minuteRepository.findOne({where: {id: idMinute}});
    }


    public async getMinuteByIdAssociation(idAssocation: number): Promise<Minute[]> {
        return await this.minuteRepository.find({where: {association: {id: idAssocation}}});
    }


    public async updateMinute(idMinute: number, updateMinuteDto: UpdateMinuteDto): Promise<Minute> {
        const minuteToUpdate = await this.getMinuteById(idMinute);

        if (!minuteToUpdate) {
            throw new HttpException( 'Minute not found', HttpStatus.NOT_FOUND);
        }

        if (updateMinuteDto.content !== (await minuteToUpdate).content) {
            (await minuteToUpdate).content = updateMinuteDto.content
        }

        if (updateMinuteDto.date !== (await minuteToUpdate).date) {
            (await minuteToUpdate).date = updateMinuteDto.date
        }

        if (updateMinuteDto.idVoters) {
            const users = await Promise.all(
                updateMinuteDto.idVoters.map(async (idVoter) => {
                    const user = await this.usersService.getUserById(+idVoter);
                    return user? user : null;
                })
            );
            (await minuteToUpdate).voters = users.filter(user => user !== null);
        }

        await this.minuteRepository.save(await minuteToUpdate);

        return this.minuteRepository.findOne({where: {id: idMinute}});
    }


    public async deleteMinuteById(idMinute: number): Promise<boolean> {
        const minute = this.minuteRepository.findOne({where: {id: idMinute}});
        if (await minute) {
            this.minuteRepository.delete(idMinute);
            return true;
        }
        return false;
    }
}
