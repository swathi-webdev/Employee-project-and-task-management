import { Employee, Project, Task } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Swathi',
    email: 'swathi@gmail.com',
    phone: '7978872330',
    department: 'Engineering',
    designation: 'VP of Engineering',
    joiningDate: '2021-03-15',
    employmentType: 'Full-time',
    salary: 185000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    address: '742 Evergreen Terrace, Springfield, OR',
    createdAt: '2021-03-15T09:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'EMP-1002',
    name: 'Marcus Chen',
    email: 'marcus.chen@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    designation: 'Senior Frontend Architect',
    joiningDate: '2022-01-10',
    employmentType: 'Full-time',
    salary: 145000,
    reportingManagerId: 'EMP-1001',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '104 Market Street, San Francisco, CA',
    createdAt: '2022-01-10T09:00:00Z',
    updatedAt: '2024-02-15T15:30:00Z',
  },
  {
    id: 'EMP-1003',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Product',
    designation: 'Head of Product',
    joiningDate: '2021-06-01',
    employmentType: 'Full-time',
    salary: 165000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '88 King Street East, Seattle, WA',
    createdAt: '2021-06-01T09:00:00Z',
    updatedAt: '2024-01-20T10:15:00Z',
  },
  {
    id: 'EMP-1004',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Design',
    designation: 'Principal UI/UX Designer',
    joiningDate: '2022-04-18',
    employmentType: 'Full-time',
    salary: 130000,
    reportingManagerId: 'EMP-1003',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '420 Bellevue Way, Bellevue, WA',
    createdAt: '2022-04-18T09:00:00Z',
    updatedAt: '2024-02-01T11:45:00Z',
  },
  {
    id: 'EMP-1005',
    name: 'Amira Patel',
    email: 'amira.patel@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Engineering',
    designation: 'Full Stack Engineer',
    joiningDate: '2022-09-01',
    employmentType: 'Full-time',
    salary: 115000,
    reportingManagerId: 'EMP-1002',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: '55 4th Ave, Brooklyn, NY',
    createdAt: '2022-09-01T09:00:00Z',
    updatedAt: '2024-03-01T08:30:00Z',
  },
  {
    id: 'EMP-1006',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    phone: '+1 (555) 789-0123',
    department: 'Marketing',
    designation: 'Marketing Director',
    joiningDate: '2021-11-15',
    employmentType: 'Full-time',
    salary: 140000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    address: '12 Austin Way, Austin, TX',
    createdAt: '2021-11-15T09:00:00Z',
    updatedAt: '2024-01-05T14:20:00Z',
  },
  {
    id: 'EMP-1007',
    name: 'Chloe Tremblay',
    email: 'chloe.tremblay@company.com',
    phone: '+1 (555) 890-1234',
    department: 'Human Resources',
    designation: 'HR Lead & People Ops',
    joiningDate: '2022-03-01',
    employmentType: 'Full-time',
    salary: 105000,
    reportingManagerId: null,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    address: '350 Michigan Ave, Chicago, IL',
    createdAt: '2022-03-01T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
  {
    id: 'EMP-1008',
    name: 'Lucas Vance',
    email: 'lucas.vance@company.com',
    phone: '+1 (555) 901-2345',
    department: 'Engineering',
    designation: 'DevOps & Cloud Engineer',
    joiningDate: '2023-02-15',
    employmentType: 'Contract',
    salary: 95000,
    reportingManagerId: 'EMP-1001',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    address: '900 Boulder Creek Rd, Denver, CO',
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2024-03-12T13:00:00Z',
  },
  {
    id: 'EMP-1009',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@company.com',
    phone: '+1 (555) 012-3456',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    joiningDate: '2022-08-01',
    employmentType: 'Full-time',
    salary: 110000,
    reportingManagerId: null,
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '22 Ocean Boulevard, Miami, FL',
    createdAt: '2022-08-01T09:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'EMP-1010',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Junior Frontend Developer',
    joiningDate: '2023-07-10',
    employmentType: 'Intern',
    salary: 60000,
    reportingManagerId: 'EMP-1002',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    address: '15 Beacon St, Boston, MA',
    createdAt: '2023-07-10T09:00:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Enterprise Cloud Portal 2.0',
    description: 'Next-generation multi-tenant cloud analytics and management dashboard for enterprise clients.',
    managerId: 'EMP-1002',
    employeeIds: ['EMP-1002', 'EMP-1005', 'EMP-1004', 'EMP-1008', 'EMP-1010'],
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    priority: 'Urgent',
    status: 'In Progress',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'PRJ-102',
    name: 'Mobile App Redesign & Offline Sync',
    description: 'Complete visual and architectural overhaul of the iOS and Android apps with background offline synchronization.',
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
    name: 'Automated CI/CD Pipeline & SOC2 Compliance',
    description: 'Hardening security infrastructure, vulnerability scan automation, and achieving SOC2 Type II certification.',
    managerId: 'EMP-1001',
    employeeIds: ['EMP-1001', 'EMP-1008'],
    startDate: '2023-11-01',
    endDate: '2024-03-31',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2023-10-20T08:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z',
  },
  {
    id: 'PRJ-104',
    name: 'Customer Growth & Onboarding Funnel',
    description: 'Revamping self-serve signup flow and product-led growth experiments to boost 30-day user retention.',
    managerId: 'EMP-1006',
    employeeIds: ['EMP-1006', 'EMP-1003', 'EMP-1004'],
    startDate: '2024-03-01',
    endDate: '2024-05-30',
    priority: 'Medium',
    status: 'Planning',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'PRJ-105',
    name: 'Global HR Onboarding & Payroll Integration',
    description: 'Centralized employee provisioning, automated equipment logistics, and multi-country tax compliance.',
    managerId: 'EMP-1007',
    employeeIds: ['EMP-1007'],
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
        authorId: 'EMP-1002',
        authorName: 'Marcus Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Design tokens approved. We can start building the base components.',
        createdAt: '2024-02-09T14:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-1', timestamp: '2024-01-16T09:00:00Z', action: 'Created task', user: 'Marcus Chen' },
      { id: 'act-2', timestamp: '2024-02-10T16:00:00Z', action: 'Marked as Completed', user: 'David Kim' }
    ],
    version: 1,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-02-10T16:00:00Z',
  },
  {
    id: 'TSK-1002',
    title: 'Implement GraphQL schema and real-time subscription feed',
    description: 'Set up queries, mutations, and WebSocket subscriptions for instant updates across client instances.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1005',
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
        authorId: 'EMP-1005',
        authorName: 'Amira Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        content: 'Benchmarking script is ready, running tests against staging cluster today.',
        createdAt: '2024-03-14T11:20:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-3', timestamp: '2024-02-15T09:00:00Z', action: 'Created task', user: 'Marcus Chen' },
      { id: 'act-4', timestamp: '2024-02-20T10:00:00Z', action: 'Moved to In Progress', user: 'Amira Patel' }
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
    assignedEmployeeId: 'EMP-1002',
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
        authorName: 'David Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Looks great! One small padding adjustment on mobile headers requested.',
        createdAt: '2024-03-12T15:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-5', timestamp: '2024-02-25T09:00:00Z', action: 'Created task', user: 'Marcus Chen' },
      { id: 'act-6', timestamp: '2024-03-12T14:30:00Z', action: 'Moved to Review', user: 'Marcus Chen' }
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
    assignedEmployeeId: 'EMP-1005',
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
      { id: 'act-7', timestamp: '2024-02-10T10:00:00Z', action: 'Created task', user: 'Elena Rostova' }
    ],
    version: 1,
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-28T16:00:00Z',
  },
  {
    id: 'TSK-1005',
    title: 'Audit AWS IAM policies and apply Least Privilege model',
    description: 'Remove legacy admin keys, configure AWS Single Sign-On and enforce short-lived STS credentials.',
    projectId: 'PRJ-103',
    assignedEmployeeId: 'EMP-1008',
    priority: 'Urgent',
    status: 'In Progress',
    startDate: '2024-01-20',
    dueDate: '2024-03-25', // Overdue or upcoming depending on context
    estimatedHours: 35,
    actualHours: 30,
    parentTaskId: null,
    subtasks: [
      { id: 'sub-13', title: 'Scan all active IAM access keys older than 90 days', completed: true, isMandatory: true },
      { id: 'sub-14', title: 'Implement Terraform modules for RBAC', completed: true, isMandatory: true },
      { id: 'sub-15', title: 'Validate zero-trust network ingress', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-8', timestamp: '2024-01-20T11:00:00Z', action: 'Created task', user: 'Sarah Jenkins' }
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
    assignedEmployeeId: 'EMP-1004',
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
      { id: 'sub-18', title: 'React tour spotlight overlay', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-9', timestamp: '2024-03-01T14:00:00Z', action: 'Created task', user: 'James Wilson' }
    ],
    version: 1,
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
  },
  {
    id: 'TSK-1007',
    title: 'Setup E2E Playwright test suite for critical payment flow',
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
      { id: 'sub-20', title: 'Mock Stripe webhook payloads', completed: false, isMandatory: true }
    ],
    comments: [],
    activityHistory: [
      { id: 'act-10', timestamp: '2024-03-15T09:30:00Z', action: 'Created task', user: 'Marcus Chen' }
    ],
    version: 1,
    createdAt: '2024-03-15T09:30:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
  },
  {
    id: 'TSK-1008',
    title: 'Migrate legacy payroll spreadsheets to Rippling API',
    description: 'Export employee data, validate SSN/tax IDs, and synchronize direct deposit feeds.',
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
      { id: 'sub-22', title: 'Test batch dry-run with dummy data', completed: true, isMandatory: true },
      { id: 'sub-23', title: 'Production cutover and verification', completed: true, isMandatory: true }
    ],
    comments: [
      {
        id: 'comm-4',
        authorId: 'EMP-1007',
        authorName: 'Chloe Tremblay',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        content: 'Cutover successfully finished without errors.',
        createdAt: '2024-01-20T17:00:00Z'
      }
    ],
    activityHistory: [
      { id: 'act-11', timestamp: '2023-10-01T09:00:00Z', action: 'Created task', user: 'Chloe Tremblay' },
      { id: 'act-12', timestamp: '2024-01-20T17:00:00Z', action: 'Marked as Completed', user: 'Chloe Tremblay' }
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
    'VP of Engineering',
    'Senior Frontend Architect',
    'Full Stack Engineer',
    'Backend Engineer',
    'DevOps & Cloud Engineer',
    'Junior Frontend Developer',
    'QA Automation Engineer'
  ],
  Product: [
    'Head of Product',
    'Senior Product Manager',
    'Technical Product Manager',
    'Associate Product Manager'
  ],
  Design: [
    'Principal UI/UX Designer',
    'Product Designer',
    'Visual Designer',
    'User Researcher'
  ],
  Marketing: [
    'Marketing Director',
    'Content Marketing Manager',
    'SEO & Growth Specialist',
    'Product Marketing Manager'
  ],
  'Human Resources': [
    'HR Lead & People Ops',
    'Technical Recruiter',
    'HR Generalist',
    'Culture & Office Manager'
  ],
  Finance: [
    'Chief Financial Officer',
    'Senior Financial Analyst',
    'Accountant',
    'Payroll Specialist'
  ],
  Sales: [
    'VP of Global Sales',
    'Enterprise Account Executive',
    'Sales Development Representative'
  ],
  'Customer Support': [
    'Customer Support Lead',
    'Customer Success Specialist',
    'Technical Support Specialist'
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
