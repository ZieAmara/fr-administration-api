import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsInt, Length , IsPositive} from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        type: String,
        description: "The last name of the user",
        example: "Doe",
    })
    @IsNotEmpty()
    @IsString()
    lastName: string

    @ApiProperty({
        type: String,
        description: "The first name of the user",
        example: "John",
    })
    @IsNotEmpty()
    @IsString()
    firstName: string

    @ApiProperty({
        type: Number,
        description: "The age of the user",
        example: 30,
    })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    age: number

    @ApiProperty({
        type: String,
        description: "The username of the user",
        example: "john.doe",
        uniqueItems: true,
    })
    @IsNotEmpty()
    @Length(4, 20)
    @IsString()
    userName: string

    @ApiProperty({
        type: String,
        description: "The password of the user",
        example: "password",
    })
    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    userPassword: string
}