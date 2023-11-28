import { ApiProperty } from "@nestjs/swagger";

export class LogInDto {

    @ApiProperty({
        type: String,
        description: "The username of the user",
        example: "johndoe",
        uniqueItems: true,
        nullable: false,
    })
    userName: string;

    @ApiProperty({
        type: String,
        description: "The password of the user",
        example: "secret",
        nullable: false,
    })
    userPassword: string;
}