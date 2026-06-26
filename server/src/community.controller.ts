import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/collaboration')
@UseGuards(SessionAuthGuard)
export class CommunityController {
  constructor(private readonly store: StoreService) {}

  @Get('topics')
  topics() {
    return this.store.listCommunityTopics();
  }

  @Get('topics/:id')
  topic(@Param('id') topicId: string) {
    return this.store.getCommunityTopic(topicId);
  }

  @Post('topics')
  createTopic(@Req() req: any, @Body() body: any) {
    return this.store.createCommunityTopic(req.user.userId, {
      title: String(body.title ?? '').trim(),
      content: String(body.content ?? '').trim(),
      category: String(body.category ?? 'Discussion').trim(),
      tags: Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean) : [],
    });
  }

  @Post('topics/:id/posts')
  createPost(@Req() req: any, @Param('id') topicId: string, @Body() body: any) {
    return this.store.addCommunityPost(req.user.userId, topicId, String(body.content ?? '').trim());
  }

  @Post('topics/:id/like')
  likeTopic(@Req() req: any, @Param('id') topicId: string) {
    return this.store.toggleTopicLike(req.user.userId, topicId);
  }

  @Post('posts/:id/vote')
  votePost(@Req() req: any, @Param('id') postId: string) {
    return this.store.togglePostVote(req.user.userId, postId);
  }
}
