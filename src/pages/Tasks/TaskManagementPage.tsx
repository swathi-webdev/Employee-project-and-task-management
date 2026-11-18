import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { useApp } from '../../hooks/useApp';
import { KanbanBoard } from '../../components/tasks/KanbanBoard';
import { CalendarView } from '../../components/tasks/CalendarView';
import { TaskDrawer } from '../../components/tasks/TaskDrawer';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { exportTasksToCsv } from '../../utils/exportCsv';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import {
  Plus,
  Kanban,
  Table as TableIcon,
  Calendar as CalendarIcon,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  User,
} from 'lucide-react';

export const TaskManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tasks,
    projects,
    employees,
    createTask,
    updateTask,
    deleteTask,
    optimisticMoveTaskStatus,
    getEmployeeById,
    getProjectById,
  } = useApp();

  // URL parameters
  const search = searchParams.get('search') || '';
  const projectFilter = searchParams.get('project') || '';
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const assigneeFilter = searchParams.get('assignee') || '';
  const selectedTaskIdFromUrl = searchParams.get('selected');

  // View state: 'kanban' | 'table' | 'calendar'
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>('kanban');

  // Table pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer & Modals
  const [drawerTask, setDrawerTask] = useState<Task | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<TaskStatus>('To Do');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Open drawer if task ID in URL
  useEffect(() => {
    if (selectedTaskIdFromUrl) {
      const found = tasks.find(t => t.id === selectedTaskIdFromUrl);
      if (found) {
        setDrawerTask(found);
      }
    }
  }, [selectedTaskIdFromUrl, tasks]);

  const updateFilters = (key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        task.id.toLowerCase().includes(search.toLowerCase());

      const matchesProject = !projectFilter || task.projectId === projectFilter;
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesAssignee = !assigneeFilter || task.assignedEmployeeId === assigneeFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [tasks, search, projectFilter, statusFilter, priorityFilter, assigneeFilter]);

  // Sorting Logic
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let aVal = (a as any)[sortColumn];
      let bVal = (b as any)[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredTasks, sortColumn, sortDirection]);

  // Paginated data for Table View
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTasks.slice(start, start + pageSize);
  }, [sortedTasks, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedTasks.length / pageSize) || 1;

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedTasks.length && paginatedTasks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTasks.map(t => t.id));
    }
  };

  const handleExport = () => {
    const toExport = tasks.filter(t => selectedIds.includes(t.id));
    exportTasksToCsv(toExport.length > 0 ? toExport : filteredTasks, 'tasks.csv');
  };

  // Table Columns
  const columns: Column<Task>[] = [
    {
      key: 'id',
      header: 'Task ID',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-slate-500',
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: task => {
        const proj = getProjectById(task.projectId);
        return (
          <div className="max-w-xs">
            <div className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1">
              {task.title}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {proj?.name || task.projectId}
            </div>
          </div>
        );
      },
    },
    {
      key: 'assignedEmployeeId',
      header: 'Assignee',
      render: task => {
        const assignee = getEmployeeById(task.assignedEmployeeId);
        return assignee ? (
          <div className="flex items-center gap-2">
            <Avatar name={assignee.name} src={assignee.avatar} size="xs" status={assignee.status} />
            <span className="text-xs font-medium text-slate-800">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Unassigned</span>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: task => <PriorityBadge priority={task.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: task => (
        <select
          value={task.status}
          onClick={e => e.stopPropagation()}
          onChange={async e => {
            e.stopPropagation();
            await optimisticMoveTaskStatus(task.id, e.target.value as TaskStatus);
          }}
          className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: task => {
        const overdue = isTaskOverdue(task.dueDate, task.status);
        return (
          <div
            className={`text-xs flex items-center gap-1 ${
              overdue ? 'text-rose-600 font-bold' : 'text-slate-600'
            }`}
          >
            {overdue && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
            <span>{formatDate(task.dueDate)}</span>
          </div>
        );
      },
    },
    {
      key: 'estimatedHours',
      header: 'Hours',
      className: 'text-xs text-slate-500 hidden sm:table-cell',
      render: task => `${task.actualHours}h / ${task.estimatedHours}h`,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right whitespace-nowrap',
      render: task => (
        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setDrawerTask(task)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingTask(task);
              setIsFormModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingTask(task)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Task & Sprint Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize sprints, track subtask checklists, and manage deliverables across boards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: Kanban, Table, Calendar */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setNewTaskInitialStatus('To Do');
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <SearchBar
            value={search}
            onChange={val => updateFilters('search', val)}
            placeholder="Search tasks or ID..."
          />

          <FilterDropdown
            label="Project"
            value={projectFilter}
            options={projects.map(p => ({ value: p.id, label: p.name }))}
            icon={<Briefcase className="w-3.5 h-3.5" />}
            onChange={val => updateFilters('project', val)}
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={['To Do', 'In Progress', 'Review', 'Completed']}
            onChange={val => updateFilters('status', val)}
          />

          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            options={['Low', 'Medium', 'High', 'Urgent']}
            onChange={val => updateFilters('priority', val)}
          />

          <FilterDropdown
            label="Assignee"
            value={assigneeFilter}
            options={employees.map(e => ({ value: e.id, label: e.name }))}
            icon={<User className="w-3.5 h-3.5" />}
            onChange={val => updateFilters('assignee', val)}
          />
        </div>

        {/* Active Filter Chips */}
        {(search || projectFilter || statusFilter || priorityFilter || assigneeFilter) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="text-[11px] font-semibold text-slate-400">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                Search: "{search}"
                <button
                  onClick={() => updateFilters('search', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {projectFilter && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                Project: {projects.find(p => p.id === projectFilter)?.name || projectFilter}
                <button
                  onClick={() => updateFilters('project', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Status: {statusFilter}
                <button
                  onClick={() => updateFilters('status', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {priorityFilter && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Priority: {priorityFilter}
                <button
                  onClick={() => updateFilters('priority', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {assigneeFilter && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Assignee: {employees.find(e => e.id === assigneeFilter)?.name || assigneeFilter}
                <button
                  onClick={() => updateFilters('assignee', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => setSearchParams({})}
              className="text-brand-600 hover:text-brand-800 font-semibold underline text-[11px] ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* View Content: Kanban, Table, or Calendar */}
      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={task => setDrawerTask(task)}
          onAddTask={status => {
            setEditingTask(null);
            setNewTaskInitialStatus(status || 'To Do');
            setIsFormModalOpen(true);
          }}
        />
      )}

      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <DataTable<Task>
            data={paginatedTasks}
            columns={columns}
            keyExtractor={t => t.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            onRowClick={task => setDrawerTask(task)}
            emptyMessage="No tasks found matching your criteria."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedTasks.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {viewMode === 'calendar' && (
        <CalendarView
          tasks={filteredTasks}
          onTaskClick={task => setDrawerTask(task)}
        />
      )}

      {/* Task Drawer */}
      <TaskDrawer
        task={drawerTask}
        isOpen={Boolean(drawerTask)}
        onClose={() => setDrawerTask(null)}
        onDelete={async t => {
          await deleteTask(t.id);
          setDrawerTask(null);
        }}
      />

      {/* Create / Edit Task Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        defaultStatus={newTaskInitialStatus}
        onSubmit={async data => {
          if (editingTask) {
            await updateTask(editingTask.id, data, editingTask.version);
          } else {
            await createTask(data);
          }
        }}
      />

      {/* Delete Task Confirmation */}
      {deletingTask && (
        <ConfirmDialog
          isOpen={Boolean(deletingTask)}
          onClose={() => setDeletingTask(null)}
          onConfirm={async () => {
            await deleteTask(deletingTask.id);
            setDeletingTask(null);
          }}
          title="Delete Task"
          message={`Are you sure you want to permanently delete task "${deletingTask.title}" (${deletingTask.id})?`}
          confirmText="Delete Task"
          variant="danger"
        />
      )}
    </div>
  );
};
