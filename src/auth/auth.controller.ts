import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: { email: string; password: string; name?: string },
  ) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: { email: string; password: string }) {
    return this.authService.login(data);
  }

  @Get('verify-email')
  async verifyEmail(@Body() data: { token: string }) {
    return this.authService.verifyEmail(data.token);
  }

  @Get('check-email')
  async checkEmail(@Body() data: { email: string }) {
    return this.authService.checkEmailExists(data.email);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }
    return this.authService.logout(token);
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }
    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new Error('Invalid token');
    }
    return { user: { ...user, password: undefined } };
  }
}
