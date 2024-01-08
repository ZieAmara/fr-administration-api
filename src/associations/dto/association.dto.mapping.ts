import { Minute } from "src/minute/minute-table-db/minute.entity";
import { Association } from "../association-table-db/association.entity";
import { AssociationDto } from "./association.dto";
import { Member } from "./association.member";
import { AssociationMinuteDto } from "./association.minute";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { User } from "src/users/user-table-db/user.entity";
import { Role } from "src/role/role-table-db/role.entity";
import { AssociationRolesDto } from "./association.roles";

export class AssociationDtoMapping {
    

    /**
     * DTO Mapping 
     * from Association to AssociationDto
     * @param association : Association
     * @returns newAssociation : AssociationDto
     */
    public async associationToAssociationDto(association: Association): Promise<AssociationDto> {
        const newAssociation = new AssociationDto();

        newAssociation.id = association.id;
        newAssociation.name = association.name;
        newAssociation.description = association.description;
        newAssociation.roles = await this.rolesToAssociationRolesDto(association.roles);
        newAssociation.members = await this.usersToMembersDto(association.id, association.users);
        newAssociation.minutes = await this.minutesToAssociationMinutesDto(association.minutes);

        return newAssociation;
    }
    
    async rolesToAssociationRolesDto(roles: Role[]): Promise<AssociationRolesDto[]> {
        const associationRolesDtoList: AssociationRolesDto[] = [];
        for (const role of roles) {
            const newRole = new AssociationRolesDto();
            newRole.id = role.id;
            newRole.name = role.name;
            if (role.user) {
                const member = new Member()
                member.id = role.user.id;
                member.firstName = role.user.firstName;
                member.lastName = role.user.lastName;
                member.userName = role.user.userName;
                member.mail = role.user.mail;
                member.age = role.user.age;
                newRole.user = member;
            }
            associationRolesDtoList.push(newRole);
        }
        return associationRolesDtoList;
    }


    /**
     * DTO Mapping 
     * from User to Member
     * @param idAssociatoion : number
     * @param users : User[]
     * @returns Promise<Member[]>
     */
    public async usersToMembersDto(idAssociation: number, users: User[]): Promise<Member[]> {
        const members: Member[] = [];

        if (!users || users.length === 0) {
            return members;
        }

        users.forEach(user => {
            const member = new Member();

            member.id = user.id;
            member.firstName = user.firstName;
            member.lastName = user.lastName;
            member.userName = user.userName;
            member.mail = user.mail;
            member.age = user.age;
            member.role = user.roles 
                ? user.roles
                    .map(role => (role.association.id === idAssociation) ? role.name : null)
                    .filter(role => role !== null)
                    .join(', ')
                : '';

            members.push(member);
        });

        return members
    }


    /**
     * DTO Mapping 
     * from Minute to AssociationMinuteDto
     * @param minutes 
     * @returns Promise<AssociationMinuteDto[]>
     */
    public async minutesToAssociationMinutesDto(minutes: Minute[]): Promise<AssociationMinuteDto[]> {
        const newMinutes: AssociationMinuteDto[] = [];

        if (!minutes || minutes.length === 0) {
            return newMinutes;
        }

        minutes.forEach(minute => {
            const newMinute = new AssociationMinuteDto();

            newMinute.id = minute.id;
            newMinute.content = minute.content;
            newMinute.date = minute.date;
            minute.voters.forEach(user => {
                newMinute.voters.push(user.id);
            });

            newMinutes.push(newMinute);
        });

        return newMinutes
    }


    /**
     * Handle error
     * @param error 
     * @throws HttpException or QueryFailedError
     */
    public handleError(error: any) {
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