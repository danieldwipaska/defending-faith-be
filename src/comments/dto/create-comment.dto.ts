import { IsOptional, IsString, IsUUID, Max } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  postId: string;

  @IsString()
  @Max(500)
  comment: string;

  //   @IsString()
  //   username: string;
}
