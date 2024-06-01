import { RegisterUserDto } from "../dto/register-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UsersRepositoryInterface {
    create(dto: RegisterUserDto)
    findAll()
    findOne(id: number)
    update(id: number, dto: UpdateUserDto)
    delete(id: number)
    findByEmail(email: string)
    
}