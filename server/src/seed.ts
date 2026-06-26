export type StarterRole = 'ADMIN' | 'FACULTY' | 'LEARNER';

export type SeedUser = {
  id: string;
  email: string;
  fullName: string;
  role: StarterRole;
  track: string;
  bio: string;
  interests: string[];
  password: string;
};

export type StarterStore = {
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    role: StarterRole;
    track: string;
    bio: string;
    interests: string[];
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
  }>;
  topics: Array<{
    id: string;
    slug: string;
    cohortId: string;
    week: number;
    dayNumber: number;
    title: string;
    description: string;
    estimatedMinutes: number;
    orderIndex: number;
    contentItems: Array<{
      id: string;
      type: 'TEXT' | 'VIDEO' | 'QUIZ' | 'LINK';
      title: string;
      description: string;
      body?: string;
      url?: string;
      points: number;
      orderIndex: number;
      isCore: boolean;
      quiz?: {
        passingScore: number;
        questions: Array<{
          prompt: string;
          choices: string[];
          correctIndex: number;
        }>;
      };
    }>;
    reflections: string[];
  }>;
  progress: Array<{
    userId: string;
    contentItemId: string;
    topicId: string;
    completedAt: string;
    scorePercent?: number;
  }>;
  reflections: Array<{
    id: string;
    userId: string;
    topicId: string;
    questionIndex: number;
    questionText: string;
    responseText: string;
    createdAt: string;
    updatedAt: string;
  }>;
  quizPerformance: Array<{
    userId: string;
    quizId: string;
    attempts: number;
    bestScore: number;
    lastScore: number;
    passed: boolean;
    updatedAt: string;
  }>;
  communityTopics: Array<{
    id: string;
    authorId: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
    likedBy: string[];
    posts: Array<{
      id: string;
      authorId: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      votes: string[];
    }>;
  }>;
  deliverables: Array<{
    id: string;
    title: string;
    description: string;
    topicId: string;
    dueAt: string;
    rubric: string[];
  }>;
  submissions: Array<{
    id: string;
    deliverableId: string;
    userId: string;
    link: string;
    notes: string;
    status: 'SUBMITTED' | 'REVIEWED';
    submittedAt: string;
    reviewedAt?: string;
    reviewerNotes?: string;
  }>;
  feedback: Array<{
    id: string;
    createdByUserId: string;
    title: string;
    details: string;
    area: string;
    type: string;
    status: 'NEW' | 'IN_REVIEW' | 'DONE';
    createdAt: string;
  }>;
  notifications: Array<{
    id: string;
    userId: string;
    title: string;
    message: string;
    category: 'INFORMATIONAL' | 'ACTION_REQUIRED' | 'ACHIEVEMENT' | 'SOCIAL';
    createdAt: string;
    isRead: boolean;
  }>;
};

export const defaultSeedUsers: SeedUser[] = [
  {
    id: 'user-admin',
    email: 'admin@example.com',
    fullName: 'Alex Rivera',
    role: 'ADMIN',
    track: 'Program Operations',
    bio: 'Program owner focused on reusable learning operations.',
    interests: ['Templates', 'Analytics', 'Enablement'],
    password: 'Starter123!',
  },
  {
    id: 'user-faculty',
    email: 'faculty@example.com',
    fullName: 'Jordan Kim',
    role: 'FACULTY',
    track: 'Facilitation',
    bio: 'Facilitator shaping discussion, feedback, and learner momentum.',
    interests: ['Coaching', 'Community', 'Deliverables'],
    password: 'Starter123!',
  },
  {
    id: 'user-learner',
    email: 'learner@example.com',
    fullName: 'Taylor Brooks',
    role: 'LEARNER',
    track: 'Product Strategy',
    bio: 'Demo learner working through the reusable curriculum.',
    interests: ['Discovery', 'Storytelling', 'Execution'],
    password: 'Starter123!',
  },
];

export function createDefaultStore(passwordHashFor: (plain: string) => string): StarterStore {
  const now = new Date().toISOString();

  return {
    users: defaultSeedUsers.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      track: user.track,
      bio: user.bio,
      interests: user.interests,
      passwordHash: passwordHashFor(user.password),
      createdAt: now,
      updatedAt: now,
    })),
    topics: [
      {
        id: 'topic-foundation',
        slug: 'program-foundation',
        cohortId: 'starter-cohort',
        week: 1,
        dayNumber: 1,
        title: 'Program Foundation',
        description: 'Align the purpose, audience, success metrics, and learner journey for the reusable platform.',
        estimatedMinutes: 75,
        orderIndex: 1,
        contentItems: [
          {
            id: 'foundation-context',
            type: 'TEXT',
            title: 'Why This Program Exists',
            description: 'Define the transformation this platform should create for learners.',
            body: 'Document the learner before state, the target capability after state, and the core promise of the program. Keep language specific enough that future contributors can decide what belongs and what does not.',
            points: 50,
            orderIndex: 1,
            isCore: true,
          },
          {
            id: 'foundation-map',
            type: 'TEXT',
            title: 'Journey Map',
            description: 'Translate the learner experience into milestones.',
            body: 'Map the first-touch moment, guided learning loop, social reinforcement, practice opportunity, and proof of progress. This starter is designed so teams can swap content while preserving the delivery pattern.',
            points: 50,
            orderIndex: 2,
            isCore: true,
          },
          {
            id: 'foundation-quiz',
            type: 'QUIZ',
            title: 'Foundation Check',
            description: 'Quick knowledge check on audience, outcomes, and structure.',
            points: 100,
            orderIndex: 3,
            isCore: true,
            quiz: {
              passingScore: 70,
              questions: [
                {
                  prompt: 'What should stay stable when teams customize this starter?',
                  choices: ['Only colors', 'Learning flow and operating model', 'Nothing at all'],
                  correctIndex: 1,
                },
                {
                  prompt: 'What is the first artifact to clarify before scaling content?',
                  choices: ['Audience and outcome', 'Footer copy', 'Deployment region'],
                  correctIndex: 0,
                },
              ],
            },
          },
        ],
        reflections: [
          'Which part of your current learning experience feels most fragmented?',
          'What would “reuse” mean in your context: content, workflow, or both?',
        ],
      },
      {
        id: 'topic-operations',
        slug: 'operations-blueprint',
        cohortId: 'starter-cohort',
        week: 1,
        dayNumber: 2,
        title: 'Operations Blueprint',
        description: 'Shape ownership, facilitation rhythm, and review loops.',
        estimatedMinutes: 90,
        orderIndex: 2,
        contentItems: [
          {
            id: 'ops-roles',
            type: 'TEXT',
            title: 'Role Design',
            description: 'Clarify admin, facilitator, and learner responsibilities.',
            body: 'Reusable programs win when operating roles are clear. Define who curates content, who reviews submissions, who responds to feedback, and how changes move from request to published improvement.',
            points: 60,
            orderIndex: 1,
            isCore: true,
          },
          {
            id: 'ops-rituals',
            type: 'LINK',
            title: 'Operating Rituals Template',
            description: 'Starter checklist for weekly cadence.',
            url: 'https://example.com/program-rituals-template',
            points: 40,
            orderIndex: 2,
            isCore: false,
          },
          {
            id: 'ops-demo',
            type: 'VIDEO',
            title: 'Review Loop Walkthrough',
            description: 'Example review loop from submission to feedback.',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            points: 40,
            orderIndex: 3,
            isCore: false,
          },
        ],
        reflections: [
          'Where does facilitator time create the most leverage in your program?',
        ],
      },
      {
        id: 'topic-scale',
        slug: 'scale-and-measure',
        cohortId: 'starter-cohort',
        week: 1,
        dayNumber: 3,
        title: 'Scale And Measure',
        description: 'Track participation, evidence of learning, and improvement requests.',
        estimatedMinutes: 80,
        orderIndex: 3,
        contentItems: [
          {
            id: 'scale-metrics',
            type: 'TEXT',
            title: 'Metric Stack',
            description: 'Choose metrics that show momentum and quality.',
            body: 'Track participation, completion, submission quality, discussion activity, and sentiment. Avoid vanity metrics that look healthy while learners stall in the middle of the journey.',
            points: 60,
            orderIndex: 1,
            isCore: true,
          },
          {
            id: 'scale-playbook',
            type: 'TEXT',
            title: 'Iteration Playbook',
            description: 'Close the loop from feedback to release.',
            body: 'Every reusable platform needs a way to absorb field feedback without losing structure. Use a small change board, review severity weekly, and publish visible release notes so contributors trust the system.',
            points: 60,
            orderIndex: 2,
            isCore: true,
          },
        ],
        reflections: [
          'Which metrics would prove this starter is helping your learners move faster?',
        ],
      },
    ],
    progress: [
      {
        userId: 'user-learner',
        contentItemId: 'foundation-context',
        topicId: 'topic-foundation',
        completedAt: now,
      },
    ],
    reflections: [
      {
        id: 'reflection-1',
        userId: 'user-learner',
        topicId: 'topic-foundation',
        questionIndex: 0,
        questionText: 'Which part of your current learning experience feels most fragmented?',
        responseText: 'Handoffs between self-paced content and facilitator review feel disconnected today.',
        createdAt: now,
        updatedAt: now,
      },
    ],
    quizPerformance: [
      {
        userId: 'user-learner',
        quizId: 'foundation-quiz',
        attempts: 1,
        bestScore: 100,
        lastScore: 100,
        passed: true,
        updatedAt: now,
      },
    ],
    communityTopics: [
      {
        id: 'community-1',
        authorId: 'user-faculty',
        title: 'How should teams localize this starter without breaking consistency?',
        content: 'Share the layers you would customize first: curriculum, submission workflow, visual brand, or analytics.',
        category: 'Practice',
        tags: ['reuse', 'governance'],
        createdAt: now,
        updatedAt: now,
        isPinned: true,
        likedBy: ['user-learner'],
        posts: [
          {
            id: 'post-1',
            authorId: 'user-learner',
            content: 'I would localize examples and deliverables first, then adjust dashboard metrics for each cohort.',
            createdAt: now,
            updatedAt: now,
            votes: ['user-admin'],
          },
        ],
      },
    ],
    deliverables: [
      {
        id: 'deliverable-charter',
        title: 'Program Charter',
        description: 'Draft a one-page charter for your reusable learning program.',
        topicId: 'topic-foundation',
        dueAt: now,
        rubric: [
          'Clear audience statement',
          'Outcome-based success definition',
          'Visible operating rhythm',
        ],
      },
      {
        id: 'deliverable-scorecard',
        title: 'Program Scorecard',
        description: 'Define the operational metrics you will review weekly.',
        topicId: 'topic-scale',
        dueAt: now,
        rubric: [
          'Leading and lagging indicators',
          'Owner per metric',
          'Review cadence',
        ],
      },
    ],
    submissions: [
      {
        id: 'submission-1',
        deliverableId: 'deliverable-charter',
        userId: 'user-learner',
        link: 'https://example.com/program-charter',
        notes: 'First draft focused on onboarding quality.',
        status: 'REVIEWED',
        submittedAt: now,
        reviewedAt: now,
        reviewerNotes: 'Strong framing. Add explicit success metrics.',
      },
    ],
    feedback: [
      {
        id: 'feedback-1',
        createdByUserId: 'user-learner',
        title: 'Need a simpler facilitator handoff checklist',
        details: 'The transition from reflection review to feedback follow-up could use a reusable checklist.',
        area: 'OPERATIONS',
        type: 'FEATURE',
        status: 'IN_REVIEW',
        createdAt: now,
      },
    ],
    notifications: [
      {
        id: 'notification-1',
        userId: 'user-learner',
        title: 'Submission reviewed',
        message: 'Your Program Charter draft received reviewer notes.',
        category: 'ACTION_REQUIRED',
        createdAt: now,
        isRead: false,
      },
      {
        id: 'notification-2',
        userId: 'user-learner',
        title: 'Welcome to the starter platform',
        message: 'Use admin@example.com, faculty@example.com, or learner@example.com to explore the seeded workspace.',
        category: 'INFORMATIONAL',
        createdAt: now,
        isRead: false,
      },
    ],
  };
}
