import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard';
import { StoreService } from './store.service';

@Controller('api/program')
@UseGuards(SessionAuthGuard)
export class ProgramController {
  constructor(private readonly store: StoreService) {}

  @Get('topics')
  listTopics(@Req() req: any) {
    return this.store.getTopicsForUser(req.user.userId);
  }

  @Get('topics/:id')
  topicDetails(@Param('id') topicId: string, @Req() req: any) {
    return this.store.getTopicDetails(topicId, req.user.userId);
  }

  @Get('next')
  nextTopic(@Req() req: any, @Query('strategy') strategy?: string) {
    const topics = this.store.getTopicsForUser(req.user.userId);
    const available = topics.filter((topic) => topic.status === 'AVAILABLE');
    if (available.length === 0) {
      return null;
    }

    const selected = strategy === 'random'
      ? available[Math.floor(Math.random() * available.length)]
      : available[0];

    return {
      topicId: selected.ID,
      title: selected.TITLE,
      route: `/program/day/${selected.ID}`,
      reason: strategy === 'random' ? 'Random available topic.' : 'Next available topic in sequence.',
    };
  }

  @Post('content/:id/complete')
  complete(@Param('id') contentId: string, @Req() req: any, @Body() body: any) {
    return this.store.markContentComplete(req.user.userId, contentId, typeof body?.scorePercent === 'number' ? body.scorePercent : undefined);
  }

  @Delete('content/:id/complete')
  undo(@Param('id') contentId: string, @Req() req: any) {
    return this.store.undoContentComplete(req.user.userId, contentId);
  }

  @Get('topics/:id/reflections')
  reflections(@Param('id') topicId: string, @Req() req: any) {
    return this.store.getTopicDetails(topicId, req.user.userId)?.reflection ?? null;
  }

  @Get('topics/:id/reflections-feedback')
  reflectionsFeedback(@Param('id') topicId: string, @Req() req: any) {
    const reflection = this.store.getTopicDetails(topicId, req.user.userId)?.reflection;
    return {
      summary: reflection?.completed
        ? 'Reflection complete. Use answers to refine your next cohort iteration.'
        : 'Reflection still open. Capture what your team should adjust before scaling.',
    };
  }

  @Post('topics/:id/reflections')
  saveReflections(@Param('id') topicId: string, @Req() req: any, @Body() body: any) {
    return this.store.saveReflectionAnswers(req.user.userId, topicId, Array.isArray(body?.answers) ? body.answers.map(String) : []);
  }

  @Get('quiz-performance')
  quizPerformance(@Req() req: any) {
    return this.store.listQuizPerformance(req.user.userId);
  }

  @Post('quiz-performance')
  saveQuizPerformance(@Req() req: any, @Body() body: any) {
    return this.store.saveQuizPerformance(req.user.userId, {
      quizId: String(body.quizId ?? ''),
      scorePercent: Number(body.scorePercent ?? 0),
    });
  }
}
