import { ApiProperty } from "@nestjs/swagger";

export class LogInDto {

    @ApiProperty({
        type: String,
        description: "The username of the user",
        example: "adam.dro",
        nullable: false,
    })
    userName: string;

    @ApiProperty({
        type: String,
        description: "The password of the user",
        example: "password",
        nullable: false,
    })
    userPassword: string;
}