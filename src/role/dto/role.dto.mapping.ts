import { User } from "src/users/user-table-db/user.entity";
import { Role } from "../role-table-db/role.entity";
import { RoleDto } from "./role.dto";
import { RoleUserDto } from "./role.user";
import { Association } from "src/associations/association-table-db/association.entity";
import { RoleAssociationDto } from "./role.association";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class RoleDTOMapping {

    /**
     * DTO Mapping 
     * from Role to RoleDto
     * @param createRoleDto 
     * @returns Promise<RoleDto>
     */
    public async roleToRoleDto(role: Role): Promise<RoleDto> {
        const newRole = new RoleDto();
        newRole.id = role.id;
        newRole.name = role.name;
        newRole.user = await this.usersToRoleUsersDto(role.user);
        newRole.association = await this.associationsToRoleAssociationsDto(role.association);
        return newRole;
    }



    /**
     * DTO Mapping 
     * from User to RoleUserDto
     * @param user 
     * @returns Promise<RoleUserDto>
     */
    public async usersToRoleUsersDto(user: User): Promise<RoleUserDto> {
        const newUsers = new RoleUserDto();

        if (!user) {
            return newUsers;
        }

        newUsers.idUser = user.id;
        newUsers.firstName = user.firstName;
        newUsers.lastName = user.lastName;
        newUsers.userName = user.userName;
        newUsers.mail = user.mail;
        newUsers.age = user.age;

        return newUsers;
    }


    /**
     * DTO Mapping 
     * from Association to RoleAssociationDto
     * @param association 
     * @returns Promise<RoleAssociationDto>
     */
    public async associationsToRoleAssociationsDto(association: Association): Promise<RoleAssociationDto> {
        const newAssociation = new RoleAssociationDto();
        
        if (!association) {
            return newAssociation;
        }

        newAssociation.idAssociation = association.id;
        newAssociation.name = association.name;
        newAssociation.description = association.description;

        return newAssociation;
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