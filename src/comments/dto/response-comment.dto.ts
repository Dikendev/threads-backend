import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class ResponseCommentDto extends CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;

  @IsNumber()
  likes: number;
}
