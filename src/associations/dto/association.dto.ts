import { Member } from "./association.member";
import { AssociationMinuteDto } from "./association.minute";

export class AssociationDto {
    public id: number;
    public name: string;
    public members: Member[];
    public minutes: AssociationMinuteDto[];
}