import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateUserDto,
  FindUserByIdDto,
  // FindUserByEmailDto,
  CreateUserDto,
} from './dto';
import { PrismaUserRepository } from '../../infra/database/repositories/prisma_user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prismaUserRepository: PrismaUserRepository) {}

  async createOrUpdate(dto: CreateUserDto) {
    return await this.prismaUserRepository.save(dto);
  }

  // async create(dto: CreateUserDto, hash: string) {
  //   return await this.prismaUserRepository.create(dto, hash);
  // }

  async findAll(): Promise<User[]> {
    const user = await this.prismaUserRepository.list();
    if (!user) {
      throw new NotFoundException(`User not exist.`);
    }
    return user;
  }

  async findUserById(dto: FindUserByIdDto) {
    const user = await this.prismaUserRepository.findUserById(dto.id);
    if (!user) {
      throw new NotFoundException(`User not exist.`);
    }
    return user;
  }

  // async findUserByEmail(dto: FindUserByEmailDto) {
  //   const user = await this.prismaUserRepository.findUserByEmail(dto);
  //   return user;
  // }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prismaUserRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.prismaUserRepository.delete(id);
  }
}
