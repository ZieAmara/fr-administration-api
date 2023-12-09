import { Member } from "./association.member";

export class AssociationDto {
    public id: number;
    public name: string;
    public members: Member[];
}