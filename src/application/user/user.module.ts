import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaUserRepository } from '../../infra/database/repositories/prisma_user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaUserRepository],
  exports: [UserService],
})
export class UserModule {}
