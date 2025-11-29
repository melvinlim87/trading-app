import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.socialService.createPost(req.user.id, createPostDto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get social feed' })
  getFeed(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.socialService.getFeed(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  getPost(@Param('id') id: string) {
    return this.socialService.getPost(id);
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment' })
  createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.socialService.createComment(req.user.id, createCommentDto);
  }

  @Post('reactions/:postId/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle reaction on a post' })
  toggleReaction(
    @Request() req,
    @Param('postId') postId: string,
    @Param('type') type: string,
  ) {
    return this.socialService.toggleReaction(req.user.id, postId, type);
  }

  @Post('follow/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow/unfollow a user' })
  followUser(@Request() req, @Param('userId') userId: string) {
    return this.socialService.followUser(req.user.id, userId);
  }
}
