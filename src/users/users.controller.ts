import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../generated/prisma';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const user = await this.usersService.findOne(parseInt(id));
    return user || null;
  }

  @Post()
  async create(@Body() data: { email: string; name?: string }): Promise<User> {
    return this.usersService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { email?: string; name?: string },
  ): Promise<User> {
    return this.usersService.update(parseInt(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.delete(parseInt(id));
  }
}
