import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create comments' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get comments by user' })
  @ApiOkResponse({ type: CreateCommentDto })
  getCommentsByUser(@Param('id') id: string) {
    return this.commentsService.getCommentsByUser(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all comments' })
  @ApiOkResponse({ type: CreateCommentDto })
  getComments(@Query() queryParams) {
    if (queryParams.parentId) {
      return this.commentsService.getCommentsByParentId(queryParams.parentId);
    }

    return this.commentsService.getTopLevelComments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find comments by user id' })
  getOne(@Param('id') id: string) {
    return this.commentsService.getOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Find comment by comment id' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
