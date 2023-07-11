import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../../../application/users/dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../../../application/users/dto/update-user.dto';
import {
  FindUserByEmailDto,
  FindUserByIdDto,
} from '../../../application/users/dto/find-user-params.dto';

@Injectable()
export class PrismaUsersRepository {
  logger = new Logger(PrismaUsersRepository.name);
  constructor(private prisma: PrismaService) {}

  async createUser({ name, email, password }: CreateUserDto): Promise<User> {
    const result = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash: password,
      },
    });
    return result;
  }

  async findUserById({ id }: FindUserByIdDto): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });
    return result;
  }

  async findUserByEmail({ email }: FindUserByEmailDto): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return result;
  }

  async deleteUser(id: string): Promise<User> {
    const result = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return result;
  }

  async listUsers(): Promise<User[]> {
    const result = await this.prisma.user.findMany();
    return result;
  }
}
