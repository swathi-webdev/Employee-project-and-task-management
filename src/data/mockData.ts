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
    name: 'Personal productivity dashboard',
    description: `• Designed a fully responsive single-page application using React JS and Bootstrap, implementing reusable functional components and React Hooks (useState, useEffect) to manage complex UI state across task management and analytics modules.
• Built an interactive task tracking system with CRUD operations, real-time state updates, and dynamic data visualizations, enabling users to monitor productivity metrics at a glance.
• Integrated an AI assistant feature using API calls, providing contextual user support and improving overall application interactivity and engagement.`,
    managerId: 'EMP-1001',
    employeeIds: ['EMP-1001', 'EMP-1002', 'EMP-1003', 'EMP-1010'],
    startDate: '2026-11-19',
    endDate: '2027-02-23',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-11-18T22:30:00Z',
    updatedAt: '2026-11-18T22:30:00Z',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-1001',
    title: 'design figma ui',
    description: 'Design Figma UI components, interactive prototypes, and design tokens for the personal productivity dashboard.',
    projectId: 'PRJ-101',
    assignedEmployeeId: 'EMP-1010',
    priority: 'Medium',
    status: 'To Do',
    startDate: '2026-11-19',
    dueDate: '2026-11-21',
    estimatedHours: 16,
    actualHours: 0,
    parentTaskId: null,
    subtasks: [],
    comments: [],
    activityHistory: [
      { id: 'act-1', timestamp: '2026-11-18T22:30:00Z', action: 'Created task', user: 'Abi' }
    ],
    version: 1,
    createdAt: '2026-11-18T22:30:00Z',
    updatedAt: '2026-11-18T22:30:00Z',
  }
];

export const DEPARTMENTS = [
  'Engineering',
  'Developer',
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
  Developer: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'Mobile Developer',
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
