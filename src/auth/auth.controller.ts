import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //REGISTER
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.add(createUserDto);
  }

  //LOGIN
  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.validateUser(createUserDto);
  }

  //CHECK
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Req() req: Request) {
    return this.authService.verifyToken(req);
  }
}
