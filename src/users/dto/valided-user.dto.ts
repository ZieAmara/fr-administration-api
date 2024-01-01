import { ApiProperty } from "@nestjs/swagger"

export class UserValidedDto {

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

    @ApiProperty({
        type: String,
        description: "The username of the user",
        example: "john.doe",
        uniqueItems: true,
    })
    userName: string

    @ApiProperty({
        type: String,
        description: "The mail of the user",
        example: "HxSgM@example.com",
        uniqueItems: true,
    })
    mail: string

}