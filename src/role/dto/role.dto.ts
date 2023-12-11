import { RoleUserDto } from "./role.user";
import { RoleAssociationDto } from "./role.association";

export class RoleDto {
    id: number;
    name: string;
    user: RoleUserDto;
    association: RoleAssociationDto;
}