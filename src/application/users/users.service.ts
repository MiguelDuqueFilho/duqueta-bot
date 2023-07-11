import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaUsersRepository } from '../../infra/database/repositories/prisma_users.repository';
import {
  FindUserByIdDto,
  FindUserByEmailDto,
} from './dto/find-user-params.dto';

@Injectable()
export class UsersService {
  constructor(private prismaUsersRepository: PrismaUsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    console.log(createUserDto);
    return await this.prismaUsersRepository.createUser(createUserDto);
  }

  async findAll() {
    return await this.prismaUsersRepository.listUsers();
  }

  async findUserById(data: FindUserByIdDto) {
    const user = await this.prismaUsersRepository.findUserById(data);
    if (!user) {
      throw new NotFoundException(`User not exist.`);
    }
    return user;
  }

  async findUserByEmail(data: FindUserByEmailDto) {
    const user = await this.prismaUsersRepository.findUserByEmail(data);
    if (!user) {
      throw new NotFoundException(`User not exist.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return await this.prismaUsersRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.prismaUsersRepository.deleteUser(id);
  }
}
