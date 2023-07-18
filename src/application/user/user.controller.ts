import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';

import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { GetUser, Public } from '../../decorators';
import { UserService } from './user.service';
import {
  CreateUserDto,
  // FindUserByEmailDto,
  FindUserByIdDto,
  UpdateUserDto,
} from './dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Get()
  @ApiOperation({ summary: 'list users' })
  @ApiOkResponse()
  async listUsers() {
    return await this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get owner user' })
  @ApiOkResponse()
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiParam(FindUserByIdDto)
  @ApiOkResponse({ type: CreateUserDto })
  async findUserById(@Param('id') id: FindUserByIdDto) {
    return await this.userService.findUserById(id);
  }

  // @Get(':email')
  // @ApiOperation({ summary: 'get user by email' })
  // @ApiParam(FindUserByEmailDto)
  // @ApiOkResponse({ type: FindUserByEmailDto })
  // async findUserByEmail(@Param('email') dto: FindUserByEmailDto) {
  //   return await this.userService.findUserByEmail(dto);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'update user' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
