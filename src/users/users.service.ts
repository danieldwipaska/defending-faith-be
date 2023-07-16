import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';
import { CommentsService } from 'src/comments/comments.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private commentsService: CommentsService,
  ) {}

  //CREATE USER
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(createUserDto.password, salt);

      const newUser = new this.userModel({
        username: createUserDto.username,
        password: hash,
        userId: v4(),
      });

      const user = await newUser.save();

      return user;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //CHECK WHETHER USERNAME EXISTS
  async containUser(username: string): Promise<Boolean> {
    try {
      const user: User = await this.userModel.findOne({ username });

      if (user) return true;

      return false;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //FIND USER BY USERNAME
  async findByUsername(req: any): Promise<User> {
    try {
      const user: User = await this.userModel.findOne({
        username: typeof req === 'string' ? req : req.user.username,
      });

      if (!user) throw new NotFoundException('User Not Found');

      return user;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //FIND ALL USERS
  async findAll(): Promise<User[]> {
    try {
      const users: User[] = await this.userModel.find();
      if (!users.length) throw new NotFoundException('Users Not Found');

      return users;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //DELETE A USER
  async deleteById(userId: string): Promise<User> {
    try {
      await this.commentsService.deleteByUserId(userId);

      const user: User = await this.userModel.findOneAndDelete({ userId });
      if (!user) throw new NotFoundException('User Not Found');

      return user;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
