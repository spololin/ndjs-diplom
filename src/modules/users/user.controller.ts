import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { Roles } from 'src/guards/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateUserParams, SearchUserParams } from '../../interfaces/user';

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('client/register')
  async create(@Body() body: CreateUserParams) {
    const user = await this.usersService.create({
      ...body,
      role: 'client',
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post('admin/users')
  async createAdmin(@Body() body: CreateUserParams) {
    const user = await this.usersService.create(body);

    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('admin/users')
  async searchAdmin(@Query() query: SearchUserParams) {
    const users = await this.usersService.findAll(query);

    return users.map((item) => ({
      id: item._id,
      email: item.email,
      name: item.name,
      contactPhone: item.contactPhone,
      role: item.role,
    }));
  }

  @Roles('manager')
  @UseGuards(RoleGuard)
  @Get('manager/users')
  async searchManager(@Query() query: SearchUserParams) {
    const users = await this.usersService.findAll(query);

    return users.map((item) => ({
      id: item._id,
      email: item.email,
      name: item.name,
      contactPhone: item.contactPhone,
      role: item.role,
    }));
  }
}
