import { Employee, Project, Task } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Abi',
    email: 'abi@company.com',
    phone: '+91 98401 23456',
    department: 'Product',
    designation: 'Associate Product Manager',
    joiningDate: '2022-01-10',
    employmentType: 'Full-time',
    salary: 85000,
    reportingManagerId: 'EMP-1003',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '14 Mount Road, Chennai, TN',
    createdAt: '2022-01-10T09:00:00Z',
    updatedAt: '2024-02-15T15:30:00Z',
  },
  {
    id: 'EMP-1002',
    name: 'Swathi',
    email: 'swathi@company.com',
    phone: '+91 98402 34567',
    department: 'Marketing',
    designation: 'Marketing Manager',
    joiningDate: '2021-03-15',
    employmentType: 'Full-time',
    salary: 120000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    address: '42 OMR IT Expressway, Chennai, TN',
    createdAt: '2021-03-15T09:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'EMP-1003',
    name: 'Gulsan',
    email: 'gulsan@company.com',
    phone: '+91 98403 45678',
    department: 'Product',
    designation: 'Product Manager',
    joiningDate: '2021-06-01',
    employmentType: 'Full-time',
    salary: 135000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '88 Indiranagar, Bengaluru, KA',
    createdAt: '2021-06-01T09:00:00Z',
    updatedAt: '2024-01-20T10:15:00Z',
  },
  {
    id: 'EMP-1004',
    name: 'Harini',
    email: 'harini@company.com',
    phone: '+91 98404 56789',
    department: 'Design',
    designation: 'UI/UX Designer',
    joiningDate: '2022-04-18',
    employmentType: 'Full-time',
    salary: 80000,
    reportingManagerId: 'EMP-1003',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    address: '25 Koramangala 4th Block, Bengaluru, KA',
    createdAt: '2022-04-18T09:00:00Z',
    updatedAt: '2024-02-01T11:45:00Z',
  },
  {
    id: 'EMP-1005',
    name: 'Shalini',
    email: 'shalini@company.com',
    phone: '+91 98405 67890',
    department: 'Marketing',
    designation: 'Digital Marketing Executive',
    joiningDate: '2022-09-01',
    employmentType: 'Full-time',
    salary: 65000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: '10 Jubilee Hills, Hyderabad, TS',
    createdAt: '2022-09-01T09:00:00Z',
    updatedAt: '2024-03-01T08:30:00Z',
  },
  {
    id: 'EMP-1006',
    name: 'Karthika',
    email: 'karthika@company.com',
    phone: '+91 98406 78901',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2021-11-15',
    employmentType: 'Full-time',
    salary: 95000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '19 T. Nagar, Chennai, TN',
    createdAt: '2021-11-15T09:00:00Z',
    updatedAt: '2024-01-05T14:20:00Z',
  },
  {
    id: 'EMP-1007',
    name: 'Lakshmi',
    email: 'lakshmi@company.com',
    phone: '+91 98407 89012',
    department: 'Finance',
    designation: 'Finance Executive',
    joiningDate: '2022-03-01',
    employmentType: 'Full-time',
    salary: 70000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    address: '77 Bandra Kurla Complex, Mumbai, MH',
    createdAt: '2022-03-01T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
  {
    id: 'EMP-1008',
    name: 'Ishwarya',
    email: 'ishwarya@company.com',
    phone: '+91 98408 90123',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2023-02-15',
    employmentType: 'Full-time',
    salary: 68000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '50 MG Road, Kochi, KL',
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2024-03-12T13:00:00Z',
  },
  {
    id: 'EMP-1009',
    name: 'Rasika',
    email: 'rasika@company.com',
    phone: '+91 98409 01234',
    department: 'Customer Support',
    designation: 'Technical Support Engineer',
    joiningDate: '2022-08-01',
    employmentType: 'Full-time',
    salary: 58000,
    reportingManagerId: 'EMP-1002',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '33 Viman Nagar, Pune, MH',
    createdAt: '2022-08-01T09:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'EMP-1010',
    name: 'Priya',
    email: 'priya@company.com',
    phone: '+91 98410 12345',
    department: 'Design',
    designation: 'Graphic Designer',
    joiningDate: '2023-07-10',
    employmentType: 'Full-time',
    salary: 92000,
    reportingManagerId: 'EMP-1004',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    address: '105 HITEC City, Hyderabad, TS',
    createdAt: '2023-07-10T09:00:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Personal Productivity Dashboard',
    description: `• Designed a fully responsive single-page application using React JS and Bootstrap, implementing reusable functional components and React Hooks (useState, useEffect) to manage complex UI state across task management and analytics modules.
• Built an interactive task tracking system with CRUD operations, real-time state updates, and dynamic data visualizations, enabling users to monitor productivity metrics at a glance.
• Integrated an AI assistant feature using API calls, providing contextual user support and improving overall application interactivity and engagement.`,
    managerId: 'EMP-1001',
    employeeIds: ['EMP-1001', 'EMP-1002', 'EMP-1004', 'EMP-1010'],
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    priority: 'Urgent',
    status: 'In Progress',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'PRJ-102',
    name: 'Customer Engagement & Mobile Experience',
    description: `• Revamped visual design system and component tokens across web and mobile platforms.
• Integrated customer feedback telemetry and automated push notification workflows.
• Optimized load times by 45% through asset prefetching and route-level code splitting.`,
    managerId: 'EMP-1003',
    employeeIds: ['EMP-1003', 'EMP-1004', 'EMP-1005'],
    startDate: '2024-02-01',
    endDate: '2024-07-15',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-03-12T09:15:00Z',
  },
  {
    id: 'PRJ-103',
    name: 'Brand Marketing & Digital Growth Strategy',
    description: `• Launched multi-channel organic SEO campaign increasing monthly active visits by 35%.
• Established automated lead scoring and CRM integration with Sales operations.
• Redesigned brand guidelines, marketing collaterals, and landing page conversions.`,
    managerId: 'EMP-1002',
    employeeIds: ['EMP-1002', 'EMP-1005', 'EMP-1008'],
    startDate: '2023-11-01',
    endDate: '2024-03-31',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2023-10-20T08:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z',
  },
  {
    id: 'PRJ-104',
    name: 'HR Operations & People Analytics',
    description: `• Streamlined recruitment workflow and automated new hire onboarding checklists.
• Deployed quarterly performance review and employee satisfaction pulse surveys.
• Built organizational hierarchy dashboard with role-based access management.`,
    managerId: 'EMP-1006',
    employeeIds: ['EMP-1006', 'EMP-1007'],
    startDate: '2024-03-01',
    endDate: '2024-05-30',
    priority: 'Medium',
    status: 'Planning',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'PRJ-105',
    name: 'Financial Planning & Expense Automation',
    description: `• Migrated quarterly budgeting spreadsheets into real-time ledger accounting feed.
• Automated recurring vendor invoice processing and departmental expense approvals.
• Built cash-flow projections and executive compensation financial modeling.`,
    managerId: 'EMP-1007',
    employeeIds: ['EMP-1007', 'EMP-1008'],
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    priority: 'Low',
    status: 'Completed',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2024-01-31T17:00:00Z',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-1001',
    title: 'Design high-fidelity dashboard wireframes and tokens',
    description: 'Create responsive Figma specifications and design system tokens for dark and light modes.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1004',
    priority: 'High',
    status: 'Completed',
    startDate: '2024-01-16',
    dueDate: '2024-02-10',
    estimatedHours: 40,
    actualHours: 38,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-1', title: 'Color palette & contrast verification', completed: true, isMandatory: true },
      { id: 'sub-2', title: 'Typography scale & spacing tokens', completed: true, isMandatory: true },
      { id: 'sub-3', title: 'Component library export', completed: true, isMandatory: false }
    ],
    comments: [
      {
        id: 'comm-1',
        authorId: 'EMP-1001',
        authorName: 'Abi',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Design tokens approved. We can start building the base components.',
        createdAt: '2024-02-09T14:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-1', timestamp: '2024-01-16T09:00:00Z', action: 'Created task', user: 'Abi' },
      { id: 'act-2', timestamp: '2024-02-10T16:00:00Z', action: 'Marked as Completed', user: 'Harini' }
    ],
    version: 1,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
  {
    id: 'TSK-1002',
    title: 'Implement state management and real-time subscription feed',
    description: 'Set up queries, mutations, and WebSocket subscriptions for instant updates across client instances.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1001',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: '2024-02-15',
    dueDate: '2024-04-15',
    estimatedHours: 60,
    actualHours: 35,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-4', title: 'Draft schema SDL and review', completed: true, isMandatory: true },
      { id: 'sub-5', title: 'Implement WebSocket authentication middleware', completed: true, isMandatory: true },
      { id: 'sub-6', title: 'Benchmarking latency under 5,000 connections', completed: false, isMandatory: true }
    ],
    comments: [
      {
        id: 'comm-2',
        authorId: 'EMP-1001',
        authorName: 'Abi',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Benchmarking script is ready, running tests against staging cluster today.',
        createdAt: '2024-03-14T11:20:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-3', timestamp: '2024-02-15T09:00:00Z', action: 'Created task', user: 'Abi' },
      { id: 'act-4', timestamp: '2024-02-20T10:00:00Z', action: 'Moved to In Progress', user: 'Abi' }
    ],
    version: 1,
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
  },
  {
    id: 'TSK-1003',
    title: 'Build accessible Data Table with virtualization & column filters',
    description: 'Support rendering 10,000+ items smoothly with keyboard navigation, row selection, and export.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1010',
    priority: 'High',
    status: 'Review',
    startDate: '2024-02-25',
    dueDate: '2024-04-05',
    estimatedHours: 45,
    actualHours: 42,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-7', title: 'Virtual scroll windowing math', completed: true, isMandatory: true },
      { id: 'sub-8', title: 'Column sorting and multi-field filters', completed: true, isMandatory: true },
      { id: 'sub-9', title: 'ARIA labels and keyboard navigation audit', completed: true, isMandatory: true }
    ],
    comments: [
      {
        id: 'comm-3',
        authorId: 'EMP-1004',
        authorName: 'Harini',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        content: 'Looks great! One small padding adjustment on mobile headers requested.',
        createdAt: '2024-03-12T15:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-5', timestamp: '2024-02-25T09:00:00Z', action: 'Created task', user: 'Abi' },
      { id: 'act-6', timestamp: '2024-03-12T14:30:00Z', action: 'Moved to Review', user: 'Priya' }
    ],
    version: 1,
    createdAt: '2024-02-25T09:00:00Z',
    updatedAt: '2024-03-12T15:00:00Z',
  },
  {
    id: 'TSK-1004',
    title: 'Offline SQLite database cache & sync queue for mobile',
    description: 'Implement optimistic writes locally and synchronize with server upon network reconnection.',
    projectId: 'PRJ-102',
    assignedEmployeeId: 'EMP-1004',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: '2024-02-10',
    dueDate: '2024-04-20',
    estimatedHours: 55,
    actualHours: 28,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-10', title: 'Local schema migrations', completed: true, isMandatory: true },
      { id: 'sub-11', title: 'Conflict resolution strategy (Last-Write-Wins)', completed: false, isMandatory: true },
      { id: 'sub-12', title: 'Background background sync service', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-7', timestamp: '2024-02-10T10:00:00Z', action: 'Created task', user: 'Gulsan' }
    ],
    version: 1,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z',
  },
  {
    id: 'TSK-1005',
    title: 'Audit user access policies and configure RBAC permission matrix',
    description: 'Remove legacy credentials, configure Single Sign-On and enforce short-lived session tokens.',
    projectId: 'PRJ-103',
    assignedEmployeeId: 'EMP-1005',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: '2024-01-20',
    dueDate: '2024-03-25',
    estimatedHours: 35,
    actualHours: 30,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-13', title: 'Scan all active access credentials older than 90 days', completed: true, isMandatory: true },
      { id: 'sub-14', title: 'Implement role-based authorization modules', completed: true, isMandatory: true },
      { id: 'sub-15', title: 'Validate zero-trust access control', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-8', timestamp: '2024-01-20T11:00:00Z', action: 'Created task', user: 'Swathi' }
    ],
    version: 1,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'TSK-1006',
    title: 'Interactive A/B test for onboarding guided tour',
    description: 'Build modal walkthrough for first-time signups measuring drop-off rate across 4 steps.',
    projectId: 'PRJ-104',
    assignedEmployeeId: 'EMP-1006',
    priority: 'Medium',
    status: 'To Do',
    startDate: '2024-03-10',
    dueDate: '2024-04-30',
    estimatedHours: 25,
    actualHours: 0,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-16', title: 'Figma tour storyboards', completed: true, isMandatory: false },
      { id: 'sub-17', title: 'Analytics event schema definition', completed: false, isMandatory: true },
      { id: 'sub-18', title: 'Interactive walkthrough overlay', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-9', timestamp: '2024-03-01T14:00:00Z', action: 'Created task', user: 'Karthika' }
    ],
    version: 1,
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
  },
  {
    id: 'TSK-1007',
    title: 'Setup automated E2E test suite for critical client flows',
    description: 'Automate checkout and subscription upgrade testing across Chromium, Firefox and WebKit.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1010',
    priority: 'Medium',
    status: 'To Do',
    startDate: '2024-03-15',
    dueDate: '2024-05-15',
    estimatedHours: 30,
    actualHours: 4,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-19', title: 'Setup GitHub Actions matrix workflow', completed: false, isMandatory: true },
      { id: 'sub-20', title: 'Mock payment gateway webhook payloads', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-10', timestamp: '2024-03-15T09:30:00Z', action: 'Created task', user: 'Abi' }
    ],
    version: 1,
    createdAt: '2024-03-15T09:30:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
  },
  {
    id: 'TSK-1008',
    title: 'Migrate payroll spreadsheets to automated ledger feeds',
    description: 'Export employee data, validate direct deposit feeds, and automate disbursements.',
    projectId: 'PRJ-105',
    assignedEmployeeId: 'EMP-1007',
    priority: 'Low',
    status: 'Completed',
    startDate: '2023-10-01',
    dueDate: '2024-01-20',
    estimatedHours: 50,
    actualHours: 48,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-21', title: 'Data cleaning and schema matching', completed: true, isMandatory: true },
      { id: 'sub-22', title: 'Test batch dry-run with test data', completed: true, isMandatory: true },
      { id: 'sub-23', title: 'Production cutover and verification', completed: true, isMandatory: true }
    ],
    comments: [
      {
        id: 'comm-4',
        authorId: 'EMP-1007',
        authorName: 'Lakshmi',
        authorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        content: 'Cutover successfully finished without errors.',
        createdAt: '2024-01-20T17:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-11', timestamp: '2023-10-01T09:00:00Z', action: 'Created task', user: 'Lakshmi' },
      { id: 'act-12', timestamp: '2024-01-20T17:00:00Z', action: 'Marked as Completed', user: 'Lakshmi' }
    ],
    version: 1,
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2024-01-20T17:00:00Z',
  }
];

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
  'Sales',
  'Customer Support'
];

export const DESIGNATIONS_BY_DEPARTMENT: Record<string, string[]> = {
  Engineering: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'DevOps Engineer',
    'QA Engineer'
  ],
  Product: [
    'Product Manager',
    'Associate Product Manager'
  ],
  Design: [
    'UI/UX Designer',
    'Graphic Designer'
  ],
  Marketing: [
    'Digital Marketing Executive',
    'SEO Specialist',
    'Marketing Manager'
  ],
  'Human Resources': [
    'HR Manager',
    'HR Executive'
  ],
  Finance: [
    'Accountant',
    'Finance Executive'
  ],
  Sales: [
    'Sales Executive',
    'Business Development Executive'
  ],
  'Customer Support': [
    'Customer Support Executive',
    'Technical Support Engineer'
  ]
};

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
];
