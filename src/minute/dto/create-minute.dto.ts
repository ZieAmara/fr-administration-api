import { ApiProperty } from "@nestjs/swagger"
import { IsDateString } from "class-validator";

export class CreateMinuteDto {

    @ApiProperty({
        description: 'The content of the minute, should relate the accepted motions',
        example: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et sagittis sem. Praesent sollicitudin lacus.",
        type: String,
    })
    public content: string;

    @ApiProperty({
        description: 'The ids of the voters. These should be the same than the users that are members of the association',
        example: "1,2,3",
        type: Int32Array,
    })
    public idVoters: number[];

    @ApiProperty({
        description: 'The date (IsISO8601) when the general assembly occured',
        example: "AAAA-MM-JJTHH:MM:SS,ss-/+FF:ff",
        type: String,
    })
    @IsDateString()
    public date: string;

    @ApiProperty({
        description: 'The id of the association',
        example: "1",
        type: Number,
    })
    public idAssocation: number;

}