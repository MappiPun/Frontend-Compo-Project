import type { Level, Question, User } from '@/types'

export const mockLevels: Level[] = [
  {
    level: 1,
    title: 'Beginner Passport',
    passCriteriaPercentage: 60,
    benefits: [
      { id: 'b1-1', description: 'Access to Basic eLearning Courses' },
      { id: 'b1-2', description: 'Level 1 Digital Badge' }
    ],
    services: [
      {
        id: 's1-1',
        name: 'Basic Library Access',
        badge: 'L1-LIB',
        description: 'Borrow up to 2 books at a time'
      }
    ]
  },
  {
    level: 2,
    title: 'Intermediate Passport',
    passCriteriaPercentage: 70,
    benefits: [
      { id: 'b2-1', description: 'Access to Intermediate eLearning Content' },
      { id: 'b2-2', description: 'Level 2 Digital Badge' },
      { id: 'b2-3', description: 'Priority Workshop Registration' }
    ],
    services: [
      {
        id: 's2-1',
        name: 'Standard Library Access',
        badge: 'L2-LIB',
        description: 'Borrow up to 5 books at a time'
      },
      {
        id: 's2-2',
        name: 'Co-Working Space Access',
        badge: 'L2-WORK',
        description: 'Access to CAMT Study Hub'
      }
    ]
  },
  {
    level: 3,
    title: 'Advanced Passport',
    passCriteriaPercentage: 80,
    benefits: [
      { id: 'b3-1', description: 'Access to Advanced eLearning & Masterclasses' },
      { id: 'b3-2', description: 'Level 3 Digital Badge' },
      { id: 'b3-3', description: '1-on-1 Mentorship Sessions' }
    ],
    services: [
      {
        id: 's3-1',
        name: 'Premium Library Access',
        badge: 'L3-LIB',
        description: 'Borrow up to 10 books & access research databases'
      },
      {
        id: 's3-2',
        name: 'Lab Equipment Reservation',
        badge: 'L3-LAB',
        description: 'Reserve high-performance PCs and VR headsets'
      }
    ]
  },
  {
    level: 4,
    title: 'Expert Passport',
    passCriteriaPercentage: 85,
    benefits: [
      { id: 'b4-1', description: 'Full Unrestricted Access to All Resources' },
      { id: 'b4-2', description: 'Level 4 Elite Badge' },
      { id: 'b4-3', description: 'Industry Certification Sponsorship' }
    ],
    services: [
      {
        id: 's4-1',
        name: 'VIP Lounge & Incubator Access',
        badge: 'L4-VIP',
        description: '24/7 access to CAMT Innovation Lounge'
      }
    ]
  }
]

export const mockQuestions: Question[] = [
  // Level 1 Upgrade Exam
  {
    id: 'q1',
    level: 1,
    question: 'What is the primary core value of CAMT Passport?',
    options: ['Continuous Learning', 'Gaming Only', 'Social Networking', 'Food Service'],
    correctAnswerIndex: 0
  },
  {
    id: 'q2',
    level: 1,
    question: 'How many main service levels exist in CAMT Passport?',
    options: ['2 Levels', '3 Levels', '4 Levels', '5 Levels'],
    correctAnswerIndex: 2
  },

  // Level 2 Upgrade Exam
  {
    id: 'q3',
    level: 2,
    question: 'In Vue 3, which Composition API function is used to create reactive state for objects?',
    options: ['ref()', 'reactive()', 'computed()', 'watch()'],
    correctAnswerIndex: 1
  },
  {
    id: 'q4',
    level: 2,
    question: 'Which state management library is recommended for Vue 3?',
    options: ['Vuex 3', 'Redux', 'Pinia', 'Context API'],
    correctAnswerIndex: 2
  },

  // Level 3 Upgrade Exam
  {
    id: 'q5',
    level: 3,
    question: 'What is the main advantage of CI/CD pipelines in deployment?',
    options: ['Automated testing & integration', 'Slower releases', 'Manual FTP upload', 'Harder debugging'],
    correctAnswerIndex: 0
  },
  {
    id: 'q6',
    level: 3,
    question: 'Which tool is commonly used for containerizing applications?',
    options: ['Docker', 'Photoshop', 'Nginx', 'Vite'],
    correctAnswerIndex: 0
  }
]

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'user1',
    name: 'Somchai',
    surname: 'Jaidee',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Somchai',
    currentLevel: 1,
    isActive: true,
    province: 'Chiang Mai',
    examHistory: []
  },
  {
    id: 'u2',
    username: 'user2',
    name: 'Maneenat',
    surname: 'Srisuk',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maneenat',
    currentLevel: 2,
    isActive: true,
    province: 'Bangkok',
    examHistory: [
      {
        id: 'eh-1',
        userId: 'u2',
        level: 1,
        score: 2,
        totalQuestions: 2,
        percentage: 100,
        passed: true,
        attemptedAt: '2026-08-15T10:30:00Z'
      }
    ]
  },
  {
    id: 'u3',
    username: 'user3',
    name: 'Ananda',
    surname: 'Wong',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananda',
    currentLevel: 1,
    isActive: true,
    province: 'Chiang Mai',
    examHistory: []
  },
  {
    id: 'u4',
    username: 'user4',
    name: 'Kanya',
    surname: 'Ratanaporn',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kanya',
    currentLevel: 3,
    isActive: true,
    province: 'Phuket',
    examHistory: []
  },
  {
    id: 'u5',
    username: 'user5',
    name: 'Niran',
    surname: 'Prakarn',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Niran',
    currentLevel: 1,
    isActive: false,
    province: 'Chiang Mai',
    examHistory: []
  },
  {
    id: 'u6',
    username: 'user6',
    name: 'Ploy',
    surname: 'Chareon',
    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ploy',
    currentLevel: 4,
    isActive: true,
    province: 'Bangkok',
    examHistory: []
  }
]