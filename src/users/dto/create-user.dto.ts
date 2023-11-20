import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {

    @ApiProperty({
        type: String,
        description: "The last name of the user",
        example: "Doe",
    })
    lastName: string

    @ApiProperty({
        type: String,
        description: "The first name of the user",
        example: "John",
    })
    firstName: string

    @ApiProperty({
        type: Number,
        description: "The age of the user",
        example: 30,
    })
    age: number
}