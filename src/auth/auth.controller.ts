import { Controller, Get, Post, Body, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
  // return Http 200 status code
  @HttpCode(200)
  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }
  
  @Post('login')
  login(@Body() CreateAuthDto: CreateAuthDto) {
    return this.authService.login(CreateAuthDto);
  }

  @UseGuards(AuthGuard())
  @Get('test')
  test (@Req() req: Express.Request) {
    return {
      ok: true,
      message: 'test',
      user: req.user
    };
  }
  
}
