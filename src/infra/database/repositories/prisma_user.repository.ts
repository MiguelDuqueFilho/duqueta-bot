import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import {
  CreateUserDto,
  // FindUserByEmailDto,
  UpdateUserDto,
} from '../../../application/user/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaUserRepository {
  logger = new Logger(PrismaUserRepository.name);

  constructor(private prisma: PrismaService) {}

  async save(dto: CreateUserDto): Promise<User> {
    this.logger.verbose('save(dto: any): Promise<User>', dto);

    const { user_id, ...dtoUpdate } = dto;

    const user = await this.prisma.user.upsert({
      where: {
        user_id,
      },
      update: {
        ...dtoUpdate,
      },
      create: {
        ...dto,
      },
    });

    return user;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    this.logger.verbose(
      'update(userId: number, dto: EditUserDto): Promise<User>',
    );
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        } else {
          throw error;
        }
      }
    }
  }

  async list(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // async findUserByEmail(dto: FindUserByEmailDto): Promise<User> {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   return user;
  // }

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return user;
  }
}
