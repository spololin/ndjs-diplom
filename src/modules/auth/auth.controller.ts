import { Controller, HttpCode, Post, Request } from '@nestjs/common';

@Controller()
export class AuthController {
  @Post('auth/login')
  @HttpCode(200)
  login(@Request() req) {
    return req.user;
  }

  @Post('auth/logout')
  @HttpCode(200)
  logout(@Request() req) {
    req.logOut({ keepSessionInfo: false }, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
