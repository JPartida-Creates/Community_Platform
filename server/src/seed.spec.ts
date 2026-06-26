import { createDefaultStore, defaultSeedUsers, StarterStore } from './seed';
import { scryptSync } from 'crypto';

describe('Seed data', () => {
  let store: StarterStore;

  beforeEach(() => {
    const hashFn = (plain: string): string => {
      const salt = 'starter-seed-salt';
      return `${salt}:${scryptSync(plain, salt, 64).toString('hex')}`;
    };
    store = createDefaultStore(hashFn);
  });

  it('creates three seed users', () => {
    expect(store.users).toHaveLength(3);
    expect(store.users.map((u) => u.role).sort()).toEqual(['ADMIN', 'FACULTY', 'LEARNER']);
    store.users.forEach((user) => {
      expect(user.email).toContain('@example.com');
      expect(user.passwordHash).toContain(':');
    });
  });

  it('creates three curriculum topics', () => {
    expect(store.topics).toHaveLength(3);
    const titles = store.topics.map((t) => t.title);
    expect(titles).toContain('Program Foundation');
    expect(titles).toContain('Operations Blueprint');
    expect(titles).toContain('Scale And Measure');
  });

  it('includes content items in each topic', () => {
    store.topics.forEach((topic) => {
      expect(topic.contentItems.length).toBeGreaterThan(0);
      topic.contentItems.forEach((item) => {
        expect(item.id).toBeTruthy();
        expect(item.type).toMatch(/^(TEXT|VIDEO|QUIZ|LINK)$/);
      });
    });
  });

  it('includes a quiz with passing score and questions', () => {
    const foundation = store.topics.find((t) => t.id === 'topic-foundation');
    expect(foundation).toBeDefined();
    const quizItem = foundation!.contentItems.find((i) => i.type === 'QUIZ');
    expect(quizItem).toBeDefined();
    expect(quizItem!.quiz).toBeDefined();
    expect(quizItem!.quiz!.passingScore).toBe(70);
    expect(quizItem!.quiz!.questions.length).toBeGreaterThan(0);
  });

  it('includes seed progress for learner', () => {
    const learnerProgress = store.progress.filter((p) => p.userId === 'user-learner');
    expect(learnerProgress.length).toBeGreaterThan(0);
  });

  it('includes community topic with posts', () => {
    expect(store.communityTopics.length).toBeGreaterThan(0);
    const topic = store.communityTopics[0];
    expect(topic.title).toBeTruthy();
    expect(topic.posts.length).toBeGreaterThan(0);
  });

  it('includes deliverables', () => {
    expect(store.deliverables.length).toBeGreaterThan(0);
    store.deliverables.forEach((d) => {
      expect(d.rubric.length).toBeGreaterThan(0);
    });
  });

  it('includes notifications for learner', () => {
    const learnerNotifs = store.notifications.filter((n) => n.userId === 'user-learner');
    expect(learnerNotifs.length).toBeGreaterThan(0);
    expect(learnerNotifs.some((n) => !n.isRead)).toBe(true);
  });

  it('seed user default passwords produce valid hash entries', () => {
    defaultSeedUsers.forEach((seedUser) => {
      const storedUser = store.users.find((u) => u.id === seedUser.id);
      expect(storedUser).toBeDefined();
      expect(storedUser!.passwordHash.startsWith('starter-seed-salt:')).toBe(true);
    });
  });
});
