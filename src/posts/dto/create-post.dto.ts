import { IsOptional, IsString, Max } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsString()
  content: string;

  @IsString()
  categories: string;

  @IsString()
  username: string;
}
