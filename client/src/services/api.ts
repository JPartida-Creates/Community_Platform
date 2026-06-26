import type {
  CommunityTopicDetail,
  CommunityTopicListItem,
  DashboardOverview,
  Deliverable,
  FeedbackItem,
  NotificationItem,
  SessionUser,
  Topic,
  TopicDetails,
} from '../types';

const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? 'Request failed.', data);
  }

  return data as T;
}

export const api = {
  health: () => request<{ status: string; persistence: string }>('/health/db'),
  session: () => request<{ authenticated: boolean; user: SessionUser | null }>('/auth/session'),
  login: (payload: { email: string; password: string }) => request<{ authenticated: boolean; user: SessionUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  register: (payload: { email: string; fullName: string; track: string; password: string }) => request<{ message: string; user: SessionUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST', body: JSON.stringify({}) }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) => request<{ ok: boolean }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  me: () => request<SessionUser>('/me'),
  profile: () => request<any>('/profile'),
  updateProfile: (payload: { fullName: string; track: string; bio: string; interests: string[] }) => request<SessionUser>('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  myOverview: () => request<DashboardOverview>('/analytics/my-overview'),
  adminOverview: () => request<{ users: number; topics: number; submissions: number; feedbackOpen: number; communityTopics: number }>('/analytics/overview'),
  ranking: () => request<any[]>('/analytics/ranking'),
  pointsGuide: () => request<Array<{ label: string; points: number }>>('/analytics/points-guide'),
  topics: () => request<Topic[]>('/program/topics'),
  topicDetails: (topicId: string) => request<TopicDetails>(`/program/topics/${encodeURIComponent(topicId)}`),
  nextTopic: () => request<{ topicId: string; title: string; route: string; reason: string } | null>('/program/next'),
  completeContent: (contentId: string, scorePercent?: number) => request<{ ok: boolean }>(`/program/content/${encodeURIComponent(contentId)}/complete`, {
    method: 'POST',
    body: JSON.stringify(typeof scorePercent === 'number' ? { scorePercent } : {}),
  }),
  reflections: (topicId: string) => request<any>(`/program/topics/${encodeURIComponent(topicId)}/reflections`),
  reflectionsFeedback: (topicId: string) => request<{ summary: string }>(`/program/topics/${encodeURIComponent(topicId)}/reflections-feedback`),
  saveReflections: (topicId: string, answers: string[]) => request<{ saved: number }>(`/program/topics/${encodeURIComponent(topicId)}/reflections`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  }),
  quizPerformance: () => request<any[]>('/program/quiz-performance'),
  saveQuizPerformance: (payload: { quizId: string; scorePercent: number }) => request<{ ok: boolean }>('/program/quiz-performance', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  communityTopics: () => request<CommunityTopicListItem[]>('/collaboration/topics'),
  communityTopic: (topicId: string) => request<CommunityTopicDetail>(`/collaboration/topics/${encodeURIComponent(topicId)}`),
  createCommunityTopic: (payload: { title: string; content: string; category: string; tags: string[] }) => request('/collaboration/topics', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  createCommunityPost: (topicId: string, content: string) => request(`/collaboration/topics/${encodeURIComponent(topicId)}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  likeCommunityTopic: (topicId: string) => request(`/collaboration/topics/${encodeURIComponent(topicId)}/like`, {
    method: 'POST',
    body: JSON.stringify({}),
  }),
  voteCommunityPost: (postId: string) => request(`/collaboration/posts/${encodeURIComponent(postId)}/vote`, {
    method: 'POST',
    body: JSON.stringify({}),
  }),
  deliverables: () => request<Deliverable[]>('/my/deliverables'),
  submitDeliverable: (deliverableId: string, payload: { link: string; notes: string }) => request(`/my/deliverables/${encodeURIComponent(deliverableId)}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  feedback: () => request<FeedbackItem[]>('/feedback/me'),
  createFeedback: (payload: { title: string; details: string; area: string; type: string }) => request('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  notifications: () => request<NotificationItem[]>('/notifications'),
  unreadNotifications: () => request<{ unreadCount: number }>('/notifications/unread-count'),
  markNotificationRead: (notificationId: string) => request(`/notifications/${encodeURIComponent(notificationId)}/read`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', {
    method: 'POST',
    body: JSON.stringify({}),
  }),
  adminSummary: () => request('/admin/summary'),
  adminUsers: () => request<any[]>('/admin/users'),
};

export { ApiError };
