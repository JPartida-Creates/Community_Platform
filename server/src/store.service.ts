import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { createDefaultStore, StarterRole, StarterStore } from './seed';

type SessionUser = {
  userId: string;
  email: string;
  fullName: string;
  role: StarterRole;
  track: string;
  bio: string;
  interests: string[];
};

@Injectable()
export class StoreService implements OnModuleInit {
  private readonly logger = new Logger(StoreService.name);
  private readonly storePath = join(process.cwd(), 'data', 'store.json');
  private store!: StarterStore;

  onModuleInit(): void {
    this.load();
  }

  private load(): void {
    mkdirSync(dirname(this.storePath), { recursive: true });

    if (!existsSync(this.storePath)) {
      this.store = createDefaultStore(this.seedHash);
      this.save();
      this.logger.log(`Created starter data store at ${this.storePath}`);
      return;
    }

    this.store = JSON.parse(readFileSync(this.storePath, 'utf8')) as StarterStore;
  }

  private readonly seedHash = (plain: string): string => {
    const salt = 'starter-seed-salt';
    const { scryptSync } = require('crypto');
    return `${salt}:${scryptSync(plain, salt, 64).toString('hex')}`;
  };

  save(): void {
    writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
  }

  getStore(): StarterStore {
    return JSON.parse(JSON.stringify(this.store)) as StarterStore;
  }

  health() {
    return {
      status: 'connected',
      persistence: 'local-json',
      file: this.storePath,
    };
  }

  listUsers() {
    return this.store.users.map(({ passwordHash, ...user }) => user);
  }

  findUserByEmail(email: string) {
    return this.store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  findUserById(userId: string) {
    return this.store.users.find((user) => user.id === userId) ?? null;
  }

  createUser(input: {
    email: string;
    fullName: string;
    role?: StarterRole;
    track: string;
    bio?: string;
    interests?: string[];
    passwordHash: string;
  }) {
    const now = new Date().toISOString();
    const user = {
      id: `user-${Math.random().toString(36).slice(2, 10)}`,
      email: input.email,
      fullName: input.fullName,
      role: input.role ?? 'LEARNER',
      track: input.track,
      bio: input.bio ?? '',
      interests: input.interests ?? [],
      passwordHash: input.passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    this.store.users.push(user);
    this.addNotification(user.id, 'Welcome aboard', 'Explore the seeded curriculum and tailor it for your own program.', 'INFORMATIONAL');
    this.save();
    return user;
  }

  updateUser(userId: string, updates: Partial<{ fullName: string; track: string; bio: string; interests: string[]; passwordHash: string }>) {
    const user = this.findUserById(userId);
    if (!user) return null;
    if (typeof updates.fullName === 'string') user.fullName = updates.fullName;
    if (typeof updates.track === 'string') user.track = updates.track;
    if (typeof updates.bio === 'string') user.bio = updates.bio;
    if (Array.isArray(updates.interests)) user.interests = updates.interests;
    if (typeof updates.passwordHash === 'string') user.passwordHash = updates.passwordHash;
    user.updatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  toSessionUser(userId: string): SessionUser | null {
    const user = this.findUserById(userId);
    if (!user) return null;
    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      track: user.track,
      bio: user.bio,
      interests: user.interests,
    };
  }

  getTopicsForUser(userId: string) {
    const completedByTopic = new Map<string, Set<string>>();
    for (const entry of this.store.progress.filter((item) => item.userId === userId)) {
      const current = completedByTopic.get(entry.topicId) ?? new Set<string>();
      current.add(entry.contentItemId);
      completedByTopic.set(entry.topicId, current);
    }

    return this.store.topics
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((topic, index) => {
        const completed = completedByTopic.get(topic.id) ?? new Set<string>();
        const coreIds = topic.contentItems.filter((item) => item.isCore).map((item) => item.id);
        const coreDone = coreIds.every((id) => completed.has(id));
        const unlocked = index === 0 || this.store.topics.slice(0, index).every((previous) => {
          const previousCoreIds = previous.contentItems.filter((item) => item.isCore).map((item) => item.id);
          const previousDone = completedByTopic.get(previous.id) ?? new Set<string>();
          return previousCoreIds.every((id) => previousDone.has(id));
        });

        return {
          ID: topic.id,
          COHORT_ID: topic.cohortId,
          WEEK: topic.week,
          DAY_NUMBER: topic.dayNumber,
          TITLE: topic.title,
          DESCRIPTION: topic.description,
          ORDER_INDEX: topic.orderIndex,
          estimatedMinutes: topic.estimatedMinutes,
          status: coreDone ? 'COMPLETED' : unlocked ? 'AVAILABLE' : 'LOCKED',
        };
      });
  }

  getTopicDetails(topicId: string, userId: string) {
    const topic = this.store.topics.find((item) => item.id === topicId);
    if (!topic) return null;
    const progress = this.store.progress.filter((item) => item.userId === userId && item.topicId === topicId);
    const reflections = this.store.reflections.filter((item) => item.userId === userId && item.topicId === topicId);

    return {
      ID: topic.id,
      COHORT_ID: topic.cohortId,
      WEEK: topic.week,
      DAY_NUMBER: topic.dayNumber,
      TITLE: topic.title,
      DESCRIPTION: topic.description,
      ORDER_INDEX: topic.orderIndex,
      contentItems: topic.contentItems
        .slice()
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((item) => {
          const completion = progress.find((entry) => entry.contentItemId === item.id);
          return {
            ID: item.id,
            DAY_ID: topic.id,
            TYPE: item.type,
            TITLE: item.title,
            DESCRIPTION: item.description,
            BODY: item.body,
            URL: item.url,
            POINTS: item.points,
            ORDER_INDEX: item.orderIndex,
            IS_CORE: item.isCore,
            QUIZ: item.quiz,
            USER_STATUS: completion ? 'COMPLETED' : 'PENDING',
            COMPLETED_AT: completion?.completedAt ?? null,
          };
        }),
      reflection: {
        requiredCount: topic.reflections.length,
        answeredCount: reflections.length,
        completed: topic.reflections.length > 0 && reflections.length >= topic.reflections.length,
        answers: reflections.map((answer) => ({
          ID: answer.id,
          QUESTION_INDEX: answer.questionIndex,
          QUESTION_TEXT: answer.questionText,
          RESPONSE_TEXT: answer.responseText,
          CREATED_AT: answer.createdAt,
          UPDATED_AT: answer.updatedAt,
        })),
      },
    };
  }

  markContentComplete(userId: string, contentId: string, scorePercent?: number) {
    const topic = this.store.topics.find((candidate) => candidate.contentItems.some((item) => item.id === contentId));
    if (!topic) return null;

    const existing = this.store.progress.find((item) => item.userId === userId && item.contentItemId === contentId);
    if (!existing) {
      this.store.progress.push({
        userId,
        contentItemId: contentId,
        topicId: topic.id,
        completedAt: new Date().toISOString(),
        scorePercent,
      });
      this.addNotification(userId, 'Progress updated', `Marked "${topic.title}" progress as complete.`, 'ACHIEVEMENT');
      this.save();
    }

    return { ok: true };
  }

  undoContentComplete(userId: string, contentId: string) {
    this.store.progress = this.store.progress.filter((entry) => !(entry.userId === userId && entry.contentItemId === contentId));
    this.save();
    return { ok: true };
  }

  saveReflectionAnswers(userId: string, topicId: string, answers: string[]) {
    const topic = this.store.topics.find((item) => item.id === topicId);
    if (!topic) return { saved: 0 };

    const now = new Date().toISOString();
    answers.forEach((answer, index) => {
      if (!answer.trim()) return;
      const questionText = topic.reflections[index] ?? `Reflection ${index + 1}`;
      const existing = this.store.reflections.find((item) => item.userId === userId && item.topicId === topicId && item.questionIndex === index);
      if (existing) {
        existing.responseText = answer.trim();
        existing.updatedAt = now;
      } else {
        this.store.reflections.push({
          id: `reflection-${Math.random().toString(36).slice(2, 10)}`,
          userId,
          topicId,
          questionIndex: index,
          questionText,
          responseText: answer.trim(),
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    this.save();
    return { saved: answers.filter((item) => item.trim()).length };
  }

  listQuizPerformance(userId: string) {
    return this.store.quizPerformance
      .filter((item) => item.userId === userId)
      .map((item) => ({
        QUIZ_ID: item.quizId,
        ATTEMPTS: item.attempts,
        BEST_SCORE: item.bestScore,
        LAST_SCORE: item.lastScore,
        PASSED: item.passed,
        UPDATED_AT: item.updatedAt,
      }));
  }

  saveQuizPerformance(userId: string, payload: { quizId: string; scorePercent: number }) {
    const now = new Date().toISOString();
    const existing = this.store.quizPerformance.find((item) => item.userId === userId && item.quizId === payload.quizId);
    if (existing) {
      existing.attempts += 1;
      existing.lastScore = payload.scorePercent;
      existing.bestScore = Math.max(existing.bestScore, payload.scorePercent);
      existing.passed = existing.bestScore >= 70;
      existing.updatedAt = now;
    } else {
      this.store.quizPerformance.push({
        userId,
        quizId: payload.quizId,
        attempts: 1,
        bestScore: payload.scorePercent,
        lastScore: payload.scorePercent,
        passed: payload.scorePercent >= 70,
        updatedAt: now,
      });
    }
    this.save();
    return { ok: true };
  }

  getDashboardOverview(userId: string) {
    const users = this.store.users.length;
    const progress = this.store.progress.filter((item) => item.userId === userId);
    const points = this.calculatePointsForUser(userId);
    const sorted = this.getRanking().sort((a, b) => b.totalPoints - a.totalPoints);
    const rank = sorted.findIndex((item) => item.userId === userId) + 1;
    const topicCount = this.store.topics.length;
    const completedTopics = this.getTopicsForUser(userId).filter((topic) => topic.status === 'COMPLETED').length;
    const currentTopic = this.getTopicsForUser(userId).find((topic) => topic.status === 'AVAILABLE');
    const submissionsPending = this.store.deliverables.length - this.store.submissions.filter((item) => item.userId === userId).length;

    return {
      totalUsers: users,
      myPoints: points,
      myRank: rank || null,
      myProgress: topicCount === 0 ? 0 : Math.round((completedTopics / topicCount) * 100),
      completedCore: progress.length,
      totalCore: this.store.topics.flatMap((topic) => topic.contentItems.filter((item) => item.isCore)).length,
      streakDays: Math.min(progress.length, 5),
      currentTopicTitle: currentTopic?.TITLE ?? null,
      pendingDeliverables: Math.max(submissionsPending, 0),
      recentReflectionCount: this.store.reflections.filter((item) => item.userId === userId).length,
    };
  }

  getRanking() {
    return this.store.users.map((user) => ({
      userId: user.id,
      fullName: user.fullName,
      role: user.role,
      track: user.track,
      totalPoints: this.calculatePointsForUser(user.id),
      completedItems: this.store.progress.filter((item) => item.userId === user.id).length,
    }));
  }

  getPointsGuide() {
    return [
      { label: 'Read or watch core content', points: 50 },
      { label: 'Pass a quiz', points: 100 },
      { label: 'Submit a deliverable', points: 120 },
      { label: 'Join the community discussion', points: 30 },
    ];
  }

  listCommunityTopics() {
    return this.store.communityTopics
      .slice()
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.updatedAt.localeCompare(a.updatedAt))
      .map((topic) => {
        const author = this.findUserById(topic.authorId);
        return {
          ID: topic.id,
          TITLE: topic.title,
          CONTENT: topic.content,
          CATEGORY: topic.category,
          TAGS: topic.tags.join(', '),
          CREATED_AT: topic.createdAt,
          UPDATED_AT: topic.updatedAt,
          AUTHOR_ID: topic.authorId,
          AUTHOR_NAME: author?.fullName ?? 'Unknown',
          AUTHOR_ROLE: author?.role ?? 'LEARNER',
          LIKE_COUNT: topic.likedBy.length,
          POST_COUNT: topic.posts.length,
          IS_PINNED: topic.isPinned,
        };
      });
  }

  getCommunityTopic(topicId: string) {
    const topic = this.store.communityTopics.find((item) => item.id === topicId);
    if (!topic) return null;
    const author = this.findUserById(topic.authorId);
    return {
      ID: topic.id,
      TITLE: topic.title,
      CONTENT: topic.content,
      CATEGORY: topic.category,
      TAGS: topic.tags.join(', '),
      CREATED_AT: topic.createdAt,
      AUTHOR_ID: topic.authorId,
      AUTHOR_NAME: author?.fullName ?? 'Unknown',
      AUTHOR_ROLE: author?.role ?? 'LEARNER',
      LIKE_COUNT: topic.likedBy.length,
      IS_PINNED: topic.isPinned,
      posts: topic.posts.map((post) => {
        const postAuthor = this.findUserById(post.authorId);
        return {
          ID: post.id,
          AUTHOR_ID: post.authorId,
          AUTHOR_NAME: postAuthor?.fullName ?? 'Unknown',
          AUTHOR_ROLE: postAuthor?.role ?? 'LEARNER',
          CONTENT: post.content,
          CREATED_AT: post.createdAt,
          UPDATED_AT: post.updatedAt,
          VOTE_COUNT: post.votes.length,
        };
      }),
    };
  }

  createCommunityTopic(userId: string, payload: { title: string; content: string; category: string; tags: string[] }) {
    const now = new Date().toISOString();
    const topic = {
      id: `community-${Math.random().toString(36).slice(2, 10)}`,
      authorId: userId,
      title: payload.title,
      content: payload.content,
      category: payload.category,
      tags: payload.tags,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      likedBy: [],
      posts: [],
    };
    this.store.communityTopics.unshift(topic);
    this.save();
    return topic;
  }

  addCommunityPost(userId: string, topicId: string, content: string) {
    const topic = this.store.communityTopics.find((item) => item.id === topicId);
    if (!topic) return null;
    topic.posts.push({
      id: `post-${Math.random().toString(36).slice(2, 10)}`,
      authorId: userId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: [],
    });
    topic.updatedAt = new Date().toISOString();
    this.save();
    return topic;
  }

  toggleTopicLike(userId: string, topicId: string) {
    const topic = this.store.communityTopics.find((item) => item.id === topicId);
    if (!topic) return null;
    if (topic.likedBy.includes(userId)) {
      topic.likedBy = topic.likedBy.filter((id) => id !== userId);
    } else {
      topic.likedBy.push(userId);
    }
    topic.updatedAt = new Date().toISOString();
    this.save();
    return { liked: topic.likedBy.includes(userId), count: topic.likedBy.length };
  }

  togglePostVote(userId: string, postId: string) {
    for (const topic of this.store.communityTopics) {
      const post = topic.posts.find((item) => item.id === postId);
      if (!post) continue;
      if (post.votes.includes(userId)) {
        post.votes = post.votes.filter((id) => id !== userId);
      } else {
        post.votes.push(userId);
      }
      post.updatedAt = new Date().toISOString();
      this.save();
      return { voted: post.votes.includes(userId), count: post.votes.length };
    }
    return null;
  }

  listDeliverables(userId: string) {
    return this.store.deliverables.map((deliverable) => {
      const submission = this.store.submissions.find((item) => item.userId === userId && item.deliverableId === deliverable.id);
      const topic = this.store.topics.find((item) => item.id === deliverable.topicId);
      return {
        ID: deliverable.id,
        TITLE: deliverable.title,
        DESCRIPTION: deliverable.description,
        DUE_AT: deliverable.dueAt,
        RUBRIC: deliverable.rubric,
        TOPIC_TITLE: topic?.title ?? 'Unknown topic',
        submission: submission ? {
          ID: submission.id,
          LINK: submission.link,
          NOTES: submission.notes,
          STATUS: submission.status,
          SUBMITTED_AT: submission.submittedAt,
          REVIEWER_NOTES: submission.reviewerNotes ?? null,
        } : null,
      };
    });
  }

  submitDeliverable(userId: string, deliverableId: string, payload: { link: string; notes: string }) {
    const existing = this.store.submissions.find((item) => item.userId === userId && item.deliverableId === deliverableId);
    const now = new Date().toISOString();
    if (existing) {
      existing.link = payload.link;
      existing.notes = payload.notes;
      existing.status = 'SUBMITTED';
      existing.submittedAt = now;
      existing.reviewedAt = undefined;
      existing.reviewerNotes = undefined;
    } else {
      this.store.submissions.push({
        id: `submission-${Math.random().toString(36).slice(2, 10)}`,
        deliverableId,
        userId,
        link: payload.link,
        notes: payload.notes,
        status: 'SUBMITTED',
        submittedAt: now,
      });
    }
    this.addNotification(userId, 'Deliverable submitted', 'Your work is ready for facilitator review.', 'ACHIEVEMENT');
    this.save();
    return { ok: true };
  }

  listFeedback(userId: string) {
    return this.store.feedback
      .filter((item) => item.createdByUserId === userId)
      .map((item) => ({
        ID: item.id,
        TITLE: item.title,
        DETAILS: item.details,
        AREA: item.area,
        TYPE: item.type,
        STATUS: item.status,
        CREATED_AT: item.createdAt,
      }));
  }

  createFeedback(userId: string, payload: { title: string; details: string; area: string; type: string }) {
    const feedback = {
      id: `feedback-${Math.random().toString(36).slice(2, 10)}`,
      createdByUserId: userId,
      title: payload.title,
      details: payload.details,
      area: payload.area,
      type: payload.type,
      status: 'NEW' as const,
      createdAt: new Date().toISOString(),
    };
    this.store.feedback.unshift(feedback);
    this.save();
    return feedback;
  }

  listNotifications(userId: string) {
    return this.store.notifications
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((item) => ({
        ID: item.id,
        TITLE: item.title,
        MESSAGE: item.message,
        CATEGORY: item.category,
        CREATED_AT: item.createdAt,
        IS_READ: item.isRead,
      }));
  }

  markNotificationRead(userId: string, notificationId: string) {
    const notification = this.store.notifications.find((item) => item.userId === userId && item.id === notificationId);
    if (!notification) return null;
    notification.isRead = true;
    this.save();
    return { ok: true };
  }

  markAllNotificationsRead(userId: string) {
    this.store.notifications.forEach((item) => {
      if (item.userId === userId) item.isRead = true;
    });
    this.save();
    return { ok: true };
  }

  unreadNotificationCount(userId: string) {
    return this.store.notifications.filter((item) => item.userId === userId && !item.isRead).length;
  }

  adminSummary() {
    return {
      users: this.store.users.length,
      topics: this.store.topics.length,
      submissions: this.store.submissions.length,
      feedbackOpen: this.store.feedback.filter((item) => item.status !== 'DONE').length,
      communityTopics: this.store.communityTopics.length,
    };
  }

  private addNotification(userId: string, title: string, message: string, category: 'INFORMATIONAL' | 'ACTION_REQUIRED' | 'ACHIEVEMENT' | 'SOCIAL') {
    this.store.notifications.unshift({
      id: `notification-${Math.random().toString(36).slice(2, 10)}`,
      userId,
      title,
      message,
      category,
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }

  private calculatePointsForUser(userId: string) {
    const completedContentIds = new Set(this.store.progress.filter((item) => item.userId === userId).map((item) => item.contentItemId));
    const contentPoints = this.store.topics
      .flatMap((topic) => topic.contentItems)
      .filter((item) => completedContentIds.has(item.id))
      .reduce((sum, item) => sum + item.points, 0);

    const submissionPoints = this.store.submissions.filter((item) => item.userId === userId).length * 120;
    const communityPoints = this.store.communityTopics.flatMap((topic) => topic.posts).filter((post) => post.authorId === userId).length * 30;
    return contentPoints + submissionPoints + communityPoints;
  }
}
