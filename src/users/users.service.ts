import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from './repositories/users.repository.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @Inject('users__repository')
    private readonly usersRepsoitory: UsersRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      const { password } = dto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const confirmPassword = await bcrypt.compare(
        dto.password,
        hashedPassword,
      );
      if (!confirmPassword) {
        throw new Error('Error hashing password');
      }
      if (dto.password !== hashedPassword) {
        throw new Error('Password does not match hashed password');
      }
      const newUser = await this.usersRepsoitory.create({
        ...dto,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const user = await this.usersRepsoitory.findByEmail(dto.email);
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const payload = { id: user.id, role: user.role };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });
      return { access_token: token };
    } catch (error) {}
  }
}
