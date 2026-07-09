export type UserRole = 'ADMIN' | 'LEADER' | 'STUDENT' | 'PROGRAM_PARTICIPANT';

export type SessionUser = {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  track: string;
  bio: string;
  interests: string[];
};

export type TopicStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export type Topic = {
  ID: string;
  COHORT_ID: string;
  WEEK: number;
  DAY_NUMBER: number;
  TITLE: string;
  DESCRIPTION: string;
  ORDER_INDEX: number;
  estimatedMinutes: number;
  status: TopicStatus;
};

export type TopicDetails = {
  ID: string;
  TITLE: string;
  DESCRIPTION: string;
  WEEK: number;
  DAY_NUMBER: number;
  contentItems: Array<{
    ID: string;
    TYPE: 'TEXT' | 'VIDEO' | 'QUIZ' | 'LINK';
    TITLE: string;
    DESCRIPTION: string;
    BODY?: string;
    URL?: string;
    POINTS: number;
    ORDER_INDEX: number;
    IS_CORE: boolean;
    USER_STATUS: 'PENDING' | 'COMPLETED';
    COMPLETED_AT?: string | null;
    QUIZ?: {
      passingScore: number;
      questions: Array<{
        prompt: string;
        choices: string[];
        correctIndex: number;
      }>;
    };
  }>;
  reflection: {
    requiredCount: number;
    answeredCount: number;
    completed: boolean;
    answers: Array<{
      ID: string;
      QUESTION_INDEX: number;
      QUESTION_TEXT: string;
      RESPONSE_TEXT: string;
    }>;
  };
};

export type DashboardOverview = {
  totalUsers: number;
  myPoints: number;
  myRank: number | null;
  myProgress: number;
  completedCore: number;
  totalCore: number;
  streakDays: number;
  currentTopicTitle: string | null;
  pendingDeliverables: number;
  recentReflectionCount: number;
};

export type CommunityTopicListItem = {
  ID: string;
  TITLE: string;
  CONTENT: string;
  CATEGORY: string;
  TAGS: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  AUTHOR_ID: string;
  AUTHOR_NAME: string;
  AUTHOR_ROLE: UserRole;
  LIKE_COUNT: number;
  POST_COUNT: number;
  IS_PINNED: boolean;
};

export type CommunityTopicDetail = {
  ID: string;
  TITLE: string;
  CONTENT: string;
  CATEGORY: string;
  TAGS: string;
  CREATED_AT: string;
  AUTHOR_ID: string;
  AUTHOR_NAME: string;
  AUTHOR_ROLE: UserRole;
  LIKE_COUNT: number;
  IS_PINNED: boolean;
  posts: Array<{
    ID: string;
    AUTHOR_ID: string;
    AUTHOR_NAME: string;
    AUTHOR_ROLE: UserRole;
    CONTENT: string;
    CREATED_AT: string;
    UPDATED_AT: string;
    VOTE_COUNT: number;
  }>;
};

export type Deliverable = {
  ID: string;
  TITLE: string;
  DESCRIPTION: string;
  DUE_AT: string;
  RUBRIC: string[];
  TOPIC_TITLE: string;
  submission: null | {
    ID: string;
    LINK: string;
    NOTES: string;
    STATUS: string;
    SUBMITTED_AT: string;
    REVIEWER_NOTES: string | null;
  };
};

export type FeedbackItem = {
  ID: string;
  TITLE: string;
  DETAILS: string;
  AREA: string;
  TYPE: string;
  STATUS: string;
  CREATED_AT: string;
};

export type NotificationItem = {
  ID: string;
  TITLE: string;
  MESSAGE: string;
  CATEGORY: string;
  CREATED_AT: string;
  IS_READ: boolean;
};
