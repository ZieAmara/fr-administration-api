import { UserAssociationDto } from "./user.association";
import { UserRole } from "./user.role";

export class UserDto {
    public id: number;
    public lastName: string;
    public firstName: string;
    public userName: string;
    public mail: string;
    public age: number;
    public associations: UserAssociationDto[];
    public roles: UserRole[];
}