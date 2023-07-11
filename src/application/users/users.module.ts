import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUsersRepository } from '../../infra/database/repositories/prisma_users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaUsersRepository],
})
export class UsersModule {}
