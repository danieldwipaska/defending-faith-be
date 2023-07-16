import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UUID } from 'crypto';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  commentId: UUID;

  @Prop({ required: true })
  postId: UUID;

  @Prop({ required: true, max: 500 })
  comment: string;

  @Prop({ default: '' })
  username: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
