import { MinuteAssociationDto } from "./minute.association";
import { MinuteVoterDto } from "./minute.voter";

export class MinuteDto {
    public id: number;
    public content: string;
    public date: string;
    public association: MinuteAssociationDto;
    public voters: MinuteVoterDto[];
}