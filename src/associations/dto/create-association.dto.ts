import { ApiProperty } from "@nestjs/swagger";

export class CreateAssociationDto {

    @ApiProperty({
        type: [Number],
        description: "The set of user ids of this association",
        example: [1, 2, 3]
    })
    idUsers: number[];

    @ApiProperty({
        type: String,
        description: "The name of this association",
        example: "neighborhood youth association",
    })
    name: string;

    @ApiProperty({
        type: String,
        description: "The description of this association",
        example: "We are a neighborhood youth association",
    })
    description: string;
}