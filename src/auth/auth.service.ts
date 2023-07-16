import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //ADD USER
  async add(createUserDto: CreateUserDto): Promise<User> {
    try {
      const checkUser: Boolean = await this.usersService.containUser(
        createUserDto.username,
      );

      if (checkUser) throw new BadRequestException('Username Already Exists');

      return this.usersService.create(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //VALIDATE USER
  async validateUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user: User = await this.usersService.findByUsername(
        createUserDto.username,
      );
      if (!user) throw new UnauthorizedException('Wrong Credential');

      const isMatch = await bcrypt.compare(
        createUserDto.password,
        user.password,
      );
      if (!isMatch) throw new UnauthorizedException('Wrong Credential');

      const payload = {
        username: user.username,
        sub: user.userId,
      };

      const userData = {
        ...user,
        access_token: this.jwtService.sign(payload),
      };

      return userData;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  verifyToken(req: Request) {
    return true;
  }
}
