import { Employee, Project, Task } from '../types';

export const exportEmployeesToCsv = (employees: Employee[], filename = 'employees_export.csv') => {
  const headers = [
    'Employee ID',
    'Name',
    'Email',
    'Phone',
    'Department',
    'Designation',
    'Employment Type',
    'Salary',
    'Joining Date',
    'Reporting Manager ID',
    'Status',
    'Address'
  ];

  const rows = employees.map(emp => [
    emp.id,
    emp.name,
    emp.email,
    emp.phone,
    emp.department,
    emp.designation,
    emp.employmentType,
    emp.salary.toString(),
    emp.joiningDate,
    emp.reportingManagerId || 'None',
    emp.status,
    emp.address.replace(/"/g, '""')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\r\n');

  triggerDownload(csvContent, filename);
};

export const exportTasksToCsv = (tasks: Task[], filename = 'tasks_export.csv') => {
  const headers = [
    'Task ID',
    'Title',
    'Project ID',
    'Assigned Employee ID',
    'Priority',
    'Status',
    'Start Date',
    'Due Date',
    'Estimated Hours',
    'Actual Hours',
    'Subtasks Total',
    'Subtasks Done'
  ];

  const rows = tasks.map(t => [
    t.id,
    t.title.replace(/"/g, '""'),
    t.projectId,
    t.assignedEmployeeId,
    t.priority,
    t.status,
    t.startDate,
    t.dueDate,
    t.estimatedHours.toString(),
    t.actualHours.toString(),
    t.subtasks.length.toString(),
    t.subtasks.filter(s => s.completed).length.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\r\n');

  triggerDownload(csvContent, filename);
};

export const exportProjectsToCsv = (projects: Project[], filename = 'projects_export.csv') => {
  const headers = [
    'Project ID',
    'Name',
    'Description',
    'Manager ID',
    'Assigned Employees Count',
    'Start Date',
    'End Date',
    'Priority',
    'Status'
  ];

  const rows = projects.map(p => [
    p.id,
    p.name.replace(/"/g, '""'),
    p.description.replace(/"/g, '""'),
    p.managerId,
    p.employeeIds.length.toString(),
    p.startDate,
    p.endDate,
    p.priority,
    p.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\r\n');

  triggerDownload(csvContent, filename);
};

const triggerDownload = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
