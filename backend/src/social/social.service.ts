import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    const { text, attachments, symbols } = createPostDto;

    const post = await this.prisma.post.create({
      data: {
        userId,
        text,
        attachments: JSON.stringify(attachments || []),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Link instruments if provided
    if (symbols && symbols.length > 0) {
      for (const symbol of symbols) {
        const instrument = await this.prisma.instrument.findFirst({
          where: { symbol },
        });

        if (instrument) {
          await this.prisma.postInstrument.create({
            data: {
              postId: post.id,
              instrumentId: instrument.id,
            },
          });
        }
      }
    }

    return post;
  }

  async getFeed(skip = 0, take = 20) {
    const posts = await this.prisma.post.findMany({
      where: { isPublic: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        instruments: {
          include: {
            instrument: true,
          },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    });

    return posts;
  }

  async getPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        instruments: {
          include: {
            instrument: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        reactions: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    const { postId, text, parentId } = createCommentDto;

    return this.prisma.comment.create({
      data: {
        userId,
        postId,
        text,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async toggleReaction(userId: string, postId: string, type: string) {
    const existing = await this.prisma.reaction.findUnique({
      where: {
        postId_userId_type: {
          postId,
          userId,
          type,
        },
      },
    });

    if (existing) {
      await this.prisma.reaction.delete({
        where: { id: existing.id },
      });
      return { action: 'removed' };
    } else {
      await this.prisma.reaction.create({
        data: {
          userId,
          postId,
          type,
        },
      });
      return { action: 'added' };
    }
  }

  async followUser(followerId: string, followingId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) {
      await this.prisma.follow.delete({
        where: { id: existing.id },
      });
      return { action: 'unfollowed' };
    } else {
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      return { action: 'followed' };
    }
  }
}
