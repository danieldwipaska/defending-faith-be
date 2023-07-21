import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './entities/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { UUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, req: any): Promise<Comment> {
    try {
      const newComment = new this.commentModel({
        ...createCommentDto,
        commentId: v4(),
        username: req.user.username,
      });

      const savedComment: Comment = await newComment.save();

      return savedComment;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findAll(postId: UUID): Promise<Comment[]> {
    try {
      if (postId) {
        const comments: Comment[] = await this.commentModel.find({ postId });
        if (!comments) throw new NotFoundException('Comment Is Empty');

        return comments;
      } else {
        const comments: Comment[] = await this.commentModel.find();
        if (!comments) throw new NotFoundException('Comment Is Empty');

        return comments;
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string): Promise<Comment> {
    try {
      const comment: Comment = await this.commentModel.findOneAndDelete({
        commentId: id,
      });
      if (!comment) throw new NotFoundException('Comment Not Found');

      return comment;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //DELETE A USER
  async deleteByUserId(userId: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ userId });
      await this.commentModel.deleteMany({
        username: user.username,
      });

      return true;
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
