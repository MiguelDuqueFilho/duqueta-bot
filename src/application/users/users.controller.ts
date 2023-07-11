import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import {
  FindUserByIdDto,
  FindUserByEmailDto,
} from './dto/find-user-params.dto';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 200,
    description: 'The record has beem successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'The record already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List User' })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiParam(FindUserByIdDto)
  @ApiOkResponse({ type: CreateUserDto })
  async findUserById(@Param('id') id: FindUserByIdDto) {
    return await this.usersService.findUserById(id);
  }

  @Get(':email')
  @ApiOperation({ summary: 'get user by email' })
  // @ApiParam(FindUserByEmailDto)
  @ApiOkResponse({ type: CreateUserDto })
  async findUserByEmail(@Param('email') email: FindUserByEmailDto) {
    console.log(email);
    return await this.usersService.findUserByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update user' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
