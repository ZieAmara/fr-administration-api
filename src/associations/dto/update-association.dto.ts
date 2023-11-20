import { ApiProperty } from "@nestjs/swagger";

export class UpdateAssociationDto {

    @ApiProperty({
        type: [Number],
        description: "The set of user ids of this association",
        example: [1, 2, 3],
        required: false
    })
    idUsers?: number[];

    @ApiProperty({
        type: String,
        description: "The name of this association",
        example: "neighborhood youth association",
        required: false
    })
    name?: string;
}