import { StoreService } from './store.service';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { dirname, join } from 'path';

describe('StoreService core logic', () => {
  let service: StoreService;

  beforeEach(() => {
    const testDir = join(process.cwd(), 'data-test');
    mkdirSync(dirname(join(testDir, 'dummy')), { recursive: true });

    service = new StoreService();
    Object.defineProperty(service as any, 'storePath', {
      value: join(testDir, 'store.json'),
      writable: true,
    });
  });

  afterEach(() => {
    const testDir = join(process.cwd(), 'data-test');
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('initializes with seed data on first boot', () => {
    (service as any).load();
    const store = service.getStore();
    expect(store.users.length).toBeGreaterThan(0);
    expect(store.topics.length).toBeGreaterThan(0);
  });

  it('health returns connected status', () => {
    (service as any).load();
    const health = service.health();
    expect(health.status).toBe('connected');
    expect(health.persistence).toBe('local-json');
  });

  it('lists users without exposing password hashes', () => {
    (service as any).load();
    const users = service.listUsers();
    users.forEach((user: any) => {
      expect(user.passwordHash).toBeUndefined();
      expect(user.email).toBeTruthy();
    });
  });

  it('finds user by email', () => {
    (service as any).load();
    const user = service.findUserByEmail('learner@example.com');
    expect(user).not.toBeNull();
    expect(user!.role).toBe('STUDENT');
  });

  it('returns null for unknown email', () => {
    (service as any).load();
    expect(service.findUserByEmail('nobody@example.com')).toBeNull();
  });

  it('creates new user', () => {
    (service as any).load();
    const user = service.createUser({
      email: 'test@test.com',
      fullName: 'Test',
      track: 'General',
      passwordHash: 'salt:hashvalue',
    });
    expect(user.id).toMatch(/^user-/);
    expect(service.findUserByEmail('test@test.com')).not.toBeNull();
  });

  it('updates user profile', () => {
    (service as any).load();
    const updated = service.updateUser('user-learner', { fullName: 'Updated Name' });
    expect(updated).not.toBeNull();
    expect(updated!.fullName).toBe('Updated Name');
  });

  it('toSessionUser returns safe user object', () => {
    (service as any).load();
    const session = service.toSessionUser('user-admin');
    expect(session).not.toBeNull();
    expect(session!.role).toBe('ADMIN');
    expect((session as any).passwordHash).toBeUndefined();
  });

  it('getTopicsForUser returns topics with status', () => {
    (service as any).load();
    const topics = service.getTopicsForUser('user-learner');
    expect(topics.length).toBe(3);
    expect(topics.some((t: any) => t.status === 'AVAILABLE')).toBe(true);
  });

  it('getTopicDetails returns full topic data', () => {
    (service as any).load();
    const detail = service.getTopicDetails('topic-foundation', 'user-learner');
    expect(detail).not.toBeNull();
    expect(detail!.TITLE).toBe('Program Foundation');
    expect(detail!.contentItems.length).toBeGreaterThan(0);
  });

  it('returns null for unknown topic', () => {
    (service as any).load();
    expect(service.getTopicDetails('unknown', 'user-learner')).toBeNull();
  });

  it('markContentComplete adds progress', () => {
    (service as any).load();
    const result = service.markContentComplete('user-admin', 'foundation-context');
    expect(result).toEqual({ ok: true });
  });

  it('undoContentComplete removes progress', () => {
    (service as any).load();
    service.undoContentComplete('user-learner', 'foundation-context');
    const progress = (service as any).store.progress.filter(
      (p: any) => p.userId === 'user-learner' && p.contentItemId === 'foundation-context',
    );
    expect(progress).toHaveLength(0);
  });

  it('returns dashboard overview with expected keys', () => {
    (service as any).load();
    const overview = service.getDashboardOverview('user-learner');
    expect(overview.totalUsers).toBeGreaterThan(0);
    expect(overview.myPoints).toBeGreaterThanOrEqual(0);
    expect(typeof overview.myRank).toBe('number');
  });

  it('getRanking returns all users with points', () => {
    (service as any).load();
    const ranking = service.getRanking();
    expect(ranking.length).toBeGreaterThan(0);
    ranking.forEach((entry: any) => {
      expect(typeof entry.totalPoints).toBe('number');
    });
  });

  it('getPointsGuide returns categories', () => {
    (service as any).load();
    const guide = service.getPointsGuide();
    expect(guide.length).toBeGreaterThan(0);
  });

  it('community CRUD works', () => {
    (service as any).load();
    const topic = service.createCommunityTopic('user-learner', {
      title: 'Test topic',
      content: 'Test content',
      category: 'Test',
      tags: ['test'],
    });
    expect(topic.id).toMatch(/^community-/);

    const updated = service.addCommunityPost('user-faculty', topic.id, 'Reply');
    expect(updated).not.toBeNull();
    expect(updated!.posts.length).toBe(1);

    const like = service.toggleTopicLike('user-learner', topic.id);
    expect(like).not.toBeNull();
    expect(like!.liked).toBe(true);

    const vote = service.togglePostVote('user-admin', updated!.posts[0].id);
    expect(vote).not.toBeNull();
    expect(vote!.voted).toBe(true);
  });

  it('deliverables and submissions work', () => {
    (service as any).load();
    const deliverables = service.listDeliverables('user-learner');
    expect(deliverables.length).toBeGreaterThan(0);

    service.submitDeliverable('user-admin', 'deliverable-charter', {
      link: 'https://example.com',
      notes: 'Test',
    });
    const adminDeliverables = service.listDeliverables('user-admin');
    const submission = adminDeliverables.find((d: any) => d.ID === 'deliverable-charter');
    expect(submission).toBeDefined();
    expect(submission!.submission).not.toBeNull();
  });

  it('feedback CRUD works', () => {
    (service as any).load();
    const fb = service.createFeedback('user-learner', {
      title: 'Test',
      details: 'Test detail',
      area: 'UI',
      type: 'BUG',
    });
    expect(fb.id).toMatch(/^feedback-/);

    const list = service.listFeedback('user-learner');
    expect(list.length).toBeGreaterThan(0);
  });

  it('notifications mark read flow works', () => {
    (service as any).load();
    const notifs = service.listNotifications('user-learner');
    expect(notifs.length).toBeGreaterThan(0);

    const countBefore = service.unreadNotificationCount('user-learner');
    expect(countBefore).toBeGreaterThan(0);

    service.markAllNotificationsRead('user-learner');
    expect(service.unreadNotificationCount('user-learner')).toBe(0);
  });

  it('admin summary returns aggregate counts', () => {
    (service as any).load();
    const summary = service.adminSummary();
    expect(summary.users).toBeGreaterThan(0);
    expect(summary.topics).toBe(3);
    expect(summary.submissions).toBeGreaterThanOrEqual(0);
  });
});
