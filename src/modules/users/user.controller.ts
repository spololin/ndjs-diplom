import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import * as users from '../../interfaces/users';
import { UserDocument } from '../../schemas/user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('client/register')
  async register(@Body() body: users.CreateUserParams) {
    return await this.userService.create({ ...body, role: 'client' });
  }

  @Post('admin/users/')
  async registerAdmin(@Body() body: users.CreateUserDto) {
    return await this.userService.create({ ...body });
  }

  @Get('admin/users')
  async getListAdmin(@Query() query: users.SearchUserParams) {
    const users = (await this.userService.findAll(
      query,
    )) as unknown as UserDocument[];

    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }));
  }

  @Get('manager/users')
  async getListManager(@Query() query: users.SearchUserParams) {
    const users = (await this.userService.findAll(
      query,
    )) as unknown as UserDocument[];

    return users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }));
  }
}
