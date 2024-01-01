import { Role } from "../../role/role-table-db/role.entity";
import { Association } from "../../associations/association-table-db/association.entity";
import { User } from "../user-table-db/user.entity";
import { UserAssociationDto } from "./user.association";
import { UserDto } from "./user.dto";
import { UserRole } from "./user.role";
import { QueryFailedError } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

export class UserDTOMapping {
    
    /**
     * DTO Mapping 
     * from User to UserDto
     * @param user : User
     * @returns newUser : UserDto
     */
    public async userToUserDto(user: User): Promise<UserDto> {
        const newUser = new UserDto();

        newUser.id = user.id;
        newUser.lastName = user.lastName;
        newUser.firstName = user.firstName;
        newUser.userName = user.userName;
        newUser.mail = user.mail;
        newUser.age = user.age;
        newUser.associations = await this.associationsToAssociationsDto(user.associations);
        newUser.roles = await this.rolesToRolesDto(user.roles);

        return newUser;
    }


    /**
     * DTO Mapping 
     * from Association to UserAssociationDto
     * @param associations : Association[]
     * @returns newAssociations : UserAssociationDto[]
     */
    public async associationsToAssociationsDto(associations: Association[]): Promise<UserAssociationDto[]> {
        const newAssociations: UserAssociationDto[] = [];

        if (!associations || associations.length === 0) {
            return newAssociations;
        }

        associations.forEach(association => {
            const newAssociation = new UserAssociationDto();
            newAssociation.name = association.name;
            newAssociation.description = association.description;
            newAssociations.push(newAssociation);
        });

        return newAssociations;
    }


    /**
     * DTO Mapping 
     * from Role to UserRole
     * @param idUser : number
     * @param roles : Role[]
     * @returns Promise<UserRole[]>
     */
    public async rolesToRolesDto(roles: Role[]): Promise<UserRole[]> {
        const newRoles: UserRole[] = [];

        if (!roles || roles.length === 0) {
            return newRoles;
        }

        roles.forEach(role => {
            const newRole = new UserRole();
            newRole.id = role.id;
            newRole.idAssociation = role.association.id;
            newRole.name = role.name;
            newRoles.push(newRole);
        });

        return newRoles; 
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