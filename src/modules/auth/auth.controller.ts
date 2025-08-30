import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RoleGuard } from '../../guards/role.guard';

@Controller()
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
    };
  }

  @UseGuards(RoleGuard)
  @Post('auth/logout')
  async logout(@Request() req) {
    req.logout(function (err) {
      if (err) {
        return err;
      }
    });
  }
}
