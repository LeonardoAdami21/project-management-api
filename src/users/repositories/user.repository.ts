import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from './users.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserRepository implements UsersRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}
  private readonly usersRepository = this.dbClient.users;
  async create(dto: RegisterUserDto) {
    return await this.usersRepository.create({
      data: dto,
    });
  }
  findAll() {
    return this.usersRepository.findMany();
  }
  findOne(id: number) {
    return this.usersRepository.findUnique({
      where: {
        id: id,
      },
    });
  }
  update(id: number, dto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  delete(id: number) {
    throw new Error('Method not implemented.');
  }
  async findByEmail(email: string) {
    return await this.usersRepository.findFirst({
      where: {
        email: email,
      },
    });
  }
}
