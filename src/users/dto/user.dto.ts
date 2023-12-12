import { UserRole } from "./user.role";

export class UserDto {
    public id: number;
    public lastName: string;
    public firstName: string;
    public userName: string;
    public age: number;
    public roles: UserRole[];
}