# ApexCore | Enterprise Employee, Project & Task Management System

A production-grade, responsive Enterprise SaaS web application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **@dnd-kit**.

---

## 🌟 Key Features

### 1. Executive Dashboard
- **Real-Time KPIs**: Total Employees, Active Employees, Total Projects, Active Delivery Projects, Total Tasks, and Completed Deliverables.
- **Visual Analytics**:
  - Employee Department Distribution breakdown.
  - Project Pipeline Health distribution (In Progress, Planning, On Hold, Completed).
  - Sprint Task Status overview.
- **Priority Alerts**: Overdue task alert notification banner with direct navigation.
- **Live Feeds**: Recent employee hires, active project milestones, and upcoming 7-day deadlines.

### 2. Employee Management Module
- **Comprehensive Directory**:
  - Filter by Department, Designation, and Active/Inactive status.
  - Search by Name, Email, or Employee ID.
  - Column sorting (Name, Department, Joining Date, Salary, Status).
  - Configurable pagination (5, 10, 25, 50 rows per page).
  - Select-all and individual row selection.
  - Bulk actions: Bulk Activate, Bulk Deactivate, Bulk Delete, and CSV Export.
  - Inline status toggle.
- **Strict Business Rules & Validation**:
  - Automatically generated unique IDs (`EMP-XXXX`).
  - Unique email validation across the directory.
  - Valid international/local phone number format validation.
  - Joining date restricted to present or past dates (cannot be in the future).
  - Positive salary validation.
  - Reporting manager validation (must be active, cannot report to self).
  - Confirmation when discarding unsaved edits.
  - **Assignment Protection Warning**: Deactivating or deleting an employee with ongoing project or task assignments triggers a warning modal specifying the affected assignments.
- **Employee 360° Profile**:
  - Detailed personal and employment information.
  - Dynamic list of assigned projects with calculated completion percentages.
  - Direct list of assigned sprint tasks with real-time status updates.

### 3. Project Management Module
- **Portfolio Views**:
  - Switch seamlessly between **Grid View** (cards with team avatars and progress) and **Table View**.
  - Search and filter by Project Status and Priority.
- **Project Lead & Resource Allocation**:
  - Project Managers must be selected from active employees.
  - Multi-select team member allocation restricted to active personnel.
  - Start and Target End date validation (End Date $\ge$ Start Date).
  - **Dynamic Completion Calculation**: Project completion percentage is dynamically calculated from its associated tasks ($\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\%$).
- **Project Detail Page**:
  - Project description, manager, and team member list.
  - Sprint task backlog with instant filtering and inline status updates.
  - "Add Task" button pre-configured for the project.
  - Warning before deleting projects containing active tasks.

### 4. Task Management & Sprint Delivery
- **Three Specialized Views**:
  1. **Kanban Board** (@dnd-kit):
     - Four sprint stages: `To Do`, `In Progress`, `Review`, and `Completed`.
     - Drag-and-drop task movement between columns.
     - **Optimistic UI Updates with Automatic Rollback**: In the event of a simulated network failure, tasks automatically revert to their previous status with an informative error toast.
  2. **Table View**:
     - Multi-field sorting, search, and pagination.
     - Filters by Project, Status, Priority, and Assignee.
     - Inline status dropdown updates.
     - Bulk deletion and CSV export.
  3. **Calendar View**:
     - Monthly schedule grid with month-by-month navigation.
     - Highlights tasks by status: Overdue (Red), Due Today (Amber), Upcoming (Blue), Completed (Green).
- **Task Detail Drawer**:
  - Right slide-over panel for instant inspection and editing.
  - **Subtask Checklist**: Create subtasks with mandatory flags.
    - **Business Rule**: Tasks cannot be marked `Completed` while mandatory subtasks remain incomplete!
  - **Project Deadline Warning**: Warns and requires explicit confirmation if a task due date exceeds the project's target end date.
  - **Circular Dependency Guard**: Prevents cyclic parent-child task relationships.
  - **Discussion Feed**: Post comments with timestamps and author profiles.
  - **Activity Log**: Full audit trail of updates and status shifts.

### 5. Settings & Mock API Simulator
- **Simulation Tuning**:
  - Network Latency slider (50ms to 2,000ms).
  - Network Failure toggle and failure probability rate slider (5% to 60%) to test optimistic UI rollback in the Kanban board.
- **Data Persistence**:
  - Persistent state in browser `localStorage`.
  - JSON Backup Export and Import.
  - One-click "Reset to Default Demo Data" button.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v3, Plus Jakarta Sans font |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Date Engine** | `date-fns` |
| **State & Persistence** | React Context API, `localStorage` |
| **Testing** | Vitest, JSDOM, `@testing-library/react` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. **Run Unit Tests**:
   ```bash
   npm test
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📂 Project Architecture

```
src/
├── assets/
├── components/
│   ├── common/              # Reusable UI system
│   │   ├── Avatar.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── DataTable.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FilterDropdown.tsx
│   │   ├── FormInput.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SelectInput.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ToastNotification.tsx
│   ├── employees/
│   │   └── EmployeeFormModal.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectFormModal.tsx
│   └── tasks/
│       ├── CalendarView.tsx
│       ├── KanbanBoard.tsx
│       ├── TaskCard.tsx
│       ├── TaskDrawer.tsx
│       └── TaskFormModal.tsx
├── context/
│   ├── AppContext.tsx       # Central shared state for employees, projects, tasks
│   └── ToastContext.tsx     # Toast notification manager
├── data/
│   └── mockData.ts          # Realistic initial dataset
├── hooks/
│   ├── useApp.ts
│   └── useToast.ts
├── pages/
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   ├── Employees/
│   │   ├── EmployeeListPage.tsx
│   │   └── EmployeeDetailPage.tsx
│   ├── Projects/
│   │   ├── ProjectListPage.tsx
│   │   └── ProjectDetailPage.tsx
│   ├── Tasks/
│   │   └── TaskManagementPage.tsx
│   └── Settings/
│       └── SettingsPage.tsx
├── services/
│   ├── mockApi.ts           # Asynchronous CRUD with simulated latency & failures
│   └── storage.ts           # LocalStorage persistence & backup engine
├── test/
│   ├── businessRules.test.ts # API and state business rule unit tests
│   ├── setup.ts
│   └── validators.test.ts   # Form and constraint validation unit tests
├── types/
│   └── index.ts             # TypeScript interfaces for Employee, Project, Task
├── utils/
│   ├── dateUtils.ts
│   ├── exportCsv.ts
│   └── validators.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🧪 Tested Business Rules

1. **Email Uniqueness**: Case-insensitive check across all employees.
2. **Employee ID Immutability**: Auto-generated sequential ID (`EMP-XXXX`), locked during edits.
3. **Inactive Assignment Prevention**: Inactive employees cannot be assigned to projects or tasks.
4. **Mandatory Subtasks Enforcement**: Tasks cannot be marked `Completed` while mandatory subtasks are unfinished.
5. **Project Milestone Warning**: Detects when task due dates exceed project end dates and requires user confirmation.
6. **Chronological Validity**: Start dates must not be later than due/end dates.
7. **Circular Task Dependency Check**: Graph traversal to prevent parent task loops.
8. **Optimistic Updates & Rollback**: Kanban drag-and-drop recovers from failed server responses without data corruption.
