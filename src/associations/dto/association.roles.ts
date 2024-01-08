import { Member } from "./association.member";

export class AssociationRolesDto {
    id: number;
    name: string;
    user: Member;
}