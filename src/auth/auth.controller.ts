import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req: Request) {
    return this.authService.googleLogin(req);
  }
}
