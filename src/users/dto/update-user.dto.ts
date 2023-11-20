import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {

    @ApiProperty({
        type: String,
        description: "The last name of the user",
        example: "Doe",
        required: false
    })
    lastName?: string;

    @ApiProperty({
        type: String,
        description: "The first name of the user",
        example: "John",
        required: false
    })
    firstName?: string;

    @ApiProperty({
        type: Number,
        description: "The age of the user",
        example: 30,
        required: false
    })
    age?: number;
}