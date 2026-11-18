# Employee Management System (EMS)

A responsive, single-user enterprise application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It provides complete management of employees, projects, and sprint tasks with persistent client-side storage, native desktop notifications, and zero auto-refresh disruptions.

---

## 🛠️ Technologies Used & Explanation

| Technology | Purpose & Explanation |
|---|---|
| **React 19** | Powers the core frontend component architecture, utilizing modern React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) for reactive UI state management. |
| **TypeScript** | Enforces end-to-end type safety, strict interface contracts for `Employee`, `Project`, and `Task` entities, and compile-time validation. |
| **Vite** | Modern, lightning-fast frontend development server and bundler offering instant Hot Module Replacement (HMR) and optimized production builds. |
| **Tailwind CSS** | Utility-first styling framework enabling fully responsive layout design across all viewports (Mobile, Tablet, Desktop, Wide) without horizontal overflow. |
| **React Router DOM v7** | Client-side routing for seamless page navigation (`/`, `/employees`, `/projects`, `/tasks`) without page reloads. |
| **@dnd-kit** (`core`, `sortable`) | Lightweight, touch-friendly drag-and-drop library powering the interactive Kanban sprint task board with optimistic status updates. |
| **Lucide React** | Clean, lightweight SVG vector icons used throughout the interface, navigation, and badges. |
| **date-fns** | Utility library for formatting dates, calculating timeline milestones, checking overdue tasks, and tracking sprint deadlines. |
| **Web Notification API** | Browser-native desktop alerts allowing the system to send OS notifications outside the browser window. |
| **Vitest & Testing Library** | Unit testing suite verifying form validators, date consistency, and strict business rule enforcement. |

---

## 📱 Responsive Across All Viewports

The application is engineered to adapt smoothly to any screen resolution:

- **Mobile Viewport (< 640px)**:
  - Slide-out navigation drawer toggled via the header hamburger button.
  - Dropdown menus constrained to viewport width (`max-w-[calc(100vw-1.5rem)]`) to prevent clipping.
  - Data tables feature horizontal touch scrolling with essential columns prioritized.
  - Kanban sprint columns adapt with touch-friendly cards and horizontal scroll.
- **Tablet Viewport (640px – 1024px)**:
  - 2-to-3 column responsive grids for dashboard statistics and project cards.
  - Filter bars automatically wrap into clean multi-column layouts.
- **Desktop & Wide Viewport (1024px+)**:
  - Drag-adjustable sidebar width with live resize grip handle and double-click reset.
  - 100% full-width layout utilizing available screen real estate without awkward narrow centering.

---

## 💾 Data Persistence & No Auto-Refresh Architecture

- **No Automatic Page Refresh**:
  - The application **does not automatically refresh or reload the page** in the background. Forms, inputs, and active user workflows remain uninterrupted.
- **Automatic Save on User Input**:
  - Every time a user adds, edits, or deletes an employee, project, or task, the data is **immediately saved** to browser `localStorage` via the centralized storage service.
  - Data remains intact when manually refreshing the page or restarting the browser.
- **Single User Access**:
  - The application runs in streamlined single-user mode with **Abi** (`EMP-1001`) as the active user, granting full administrative access to all features without login screens.

---

## 🌐 Mock API Services & Endpoints

All data operations pass through an asynchronous service layer (`src/services/mockApi.ts`) simulating RESTful backend endpoints with realistic network latency:

### 1. Employees Service (`/api/employees`)
- `GET /api/employees` — Fetch the full directory of employees.
- `GET /api/employees/:id` — Retrieve detailed 360° employee profile by ID.
- `POST /api/employees` — Create a new employee with auto-generated ID (`EMP-XXXX`), unique email check, and validation.
- `PUT /api/employees/:id` — Update personal, departmental, or compensation details.
- `DELETE /api/employees/:id` — Remove an employee (with cascade cleanup on managers and projects).

### 2. Projects Service (`/api/projects`)
- `GET /api/projects` — Fetch all portfolio projects.
- `GET /api/projects/:id` — Retrieve project details, milestones, and assigned team members.
- `POST /api/projects` — Create a new project (validates manager must be active and end date $\ge$ start date).
- `PUT /api/projects/:id` — Update project description, timeline, status, or assigned team members.
- `DELETE /api/projects/:id` — Delete a project (with warning if active tasks are attached).

### 3. Tasks Service (`/api/tasks`)
- `GET /api/tasks` — Fetch sprint tasks across all projects.
- `GET /api/tasks/:id` — Retrieve task details, subtasks checklist, comments, and activity history.
- `POST /api/tasks` — Create a new task assigned to an active employee.
- `PUT /api/tasks/:id` — Update task details, subtasks, estimated hours, and due dates.
- `PATCH /api/tasks/:id/status` — Move task status (`To Do`, `In Progress`, `Review`, `Completed`) with optimistic UI and rollback.
- `DELETE /api/tasks/:id` — Delete a task from the sprint backlog.

---

## 🚀 Installation & Run Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository / navigate to project directory**:
   ```bash
   cd "employee management system"
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at the displayed URL (typically `http://localhost:5173`).

4. **Run Unit Tests**:
   ```bash
   npm test
   ```
   Executes Vitest covering validation rules, business logic, and API simulation.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   Generates optimized static assets in the `dist/` directory ready for deployment.
