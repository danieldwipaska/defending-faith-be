import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { Comment, CommentDocument } from 'src/comments/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, req: any): Promise<Post> {
    if (req.user.username !== 'danieldwipaska')
      throw new UnauthorizedException('Only Admin Can Make A Post');

    try {
      const post: Post = await this.postModel.findOne({
        title: createPostDto.title,
      });
      if (post) throw new BadRequestException('Post Already Exist');

      const newPost = new this.postModel({
        ...createPostDto,
        postId: v4(),
      });

      const savedPost: Post = await newPost.save();

      return savedPost;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findAll(category: string): Promise<Post[]> {
    if (!category) {
      try {
        const posts: Post[] = await this.postModel.find();
        if (!posts.length) throw new NotFoundException('Posts Is Empty');

        return posts;
      } catch (error) {
        throw new InternalServerErrorException('Internal Server Error');
      }
    } else {
      try {
        const posts: Post[] = await this.postModel.find({
          categories: category,
        });
        if (!posts.length) throw new NotFoundException('Posts Not Found');

        return posts;
      } catch (error) {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post: Post = await this.postModel.findOne({ postId: id });
      if (!post) throw new NotFoundException('Post Not Found');

      return post;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string): Promise<Post> {
    try {
      const post: Post = await this.postModel.findOneAndDelete({ postId: id });
      if (!post) throw new NotFoundException('Post Not Found');

      await this.commentModel.deleteMany({ postId: id });

      return post;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
