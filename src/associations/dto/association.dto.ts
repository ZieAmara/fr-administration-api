import { Member } from "./association.member";
import { AssociationMinuteDto } from "./association.minute";
import { AssociationRolesDto } from "./association.roles";

export class AssociationDto {
    public id: number;
    public name: string;
    public description: string;
    public roles: AssociationRolesDto[];
    public members: Member[];
    public minutes: AssociationMinuteDto[];
}