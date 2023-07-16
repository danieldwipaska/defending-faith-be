import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  @Post('verify')
  verify() {
    return this.authService.verifyToken();
  }
}
