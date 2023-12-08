import { ApiProperty } from "@nestjs/swagger"

export class UpdateRoleDto {

    @ApiProperty({
        description: 'The new name of the role of the given user in the given association',
        example: "President",
        type: String,
    })
    public name: string;
}