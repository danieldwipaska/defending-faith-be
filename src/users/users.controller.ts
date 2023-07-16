import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //GET ALL USERS
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('account')
  getUserByUsername(@Req() req: Request) {
    return this.usersService.findByUsername(req);
  }

  //DELETE A USER
  @Delete(':userId')
  removeById(@Param('userId') userId: string) {
    return this.usersService.deleteById(userId);
  }
}
