import { IsDateString, IsNumber, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class ResponseCommentDto extends CreateCommentDto {
  @IsString()
  id: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsNumber()
  likes: number;
}
