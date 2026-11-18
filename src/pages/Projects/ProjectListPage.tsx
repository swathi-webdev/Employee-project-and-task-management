import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Project, ProjectPriority, ProjectStatus } from '../../types';
import { useApp } from '../../hooks/useApp';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectFormModal } from '../../components/projects/ProjectFormModal';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { exportProjectsToCsv } from '../../utils/exportCsv';
import { formatDate } from '../../utils/dateUtils';
import {
  FolderPlus,
  LayoutGrid,
  List,
  Download,
  Eye,
  Edit,
  Trash2,
  Archive,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    getEmployeeById,
    calculateProjectProgress,
    getProjectTasks,
  } = useApp();

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Deletion confirm dialog
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

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
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesPriority = !priorityFilter || p.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, search, statusFilter, priorityFilter]);

  // Sorting
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (sortColumn === 'id') {
        const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      let aVal = (a as any)[sortColumn];
      let bVal = (b as any)[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredProjects, sortColumn, sortDirection]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProjects.slice(start, start + pageSize);
  }, [sortedProjects, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;

  // Sorting Handler
  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  // Archive Project handler
  const handleArchiveProject = async (p: Project) => {
    await updateProject(p.id, { status: 'Archived' });
  };

  // Delete project check (warn if active tasks exist)
  const getActiveTasksForProject = (projId: string) => {
    return getProjectTasks(projId).filter(t => t.status !== 'Completed');
  };

  // Table columns definition
  const columns: Column<Project>[] = [
    {
      key: 'id',
      header: 'Project #',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-slate-700 whitespace-nowrap',
      render: p => `Project ${p.id.replace(/^PRJ-?/i, '')}`,
    },
    {
      key: 'name',
      header: 'Project Name',
      sortable: true,
      render: p => (
        <div>
          <div className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
            {p.name}
          </div>
          <div className="text-xs text-slate-400 line-clamp-1">{p.description}</div>
        </div>
      ),
    },
    {
      key: 'managerId',
      header: 'Manager',
      render: p => {
        const mgr = getEmployeeById(p.managerId);
        return mgr ? (
          <div className="flex items-center gap-2">
            <Avatar name={mgr.name} src={mgr.avatar} size="xs" status={mgr.status} />
            <span className="text-xs font-medium text-slate-800">{mgr.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Unassigned</span>
        );
      },
    },
    {
      key: 'team',
      header: 'Team Members',
      render: p => (
        <div className="flex items-center -space-x-1">
          {p.employeeIds.slice(0, 3).map(empId => {
            const member = getEmployeeById(empId);
            return member ? (
              <Avatar
                key={empId}
                name={member.name}
                src={member.avatar}
                size="xs"
                className="ring-1 ring-white"
              />
            ) : null;
          })}
          {p.employeeIds.length > 3 && (
            <span className="text-[10px] text-slate-500 font-bold pl-2">
              +{p.employeeIds.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'timeline',
      header: 'Dates',
      className: 'text-xs text-slate-500 whitespace-nowrap',
      render: p => (
        <span>
          {formatDate(p.startDate, 'MMM d')} – {formatDate(p.endDate, 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: p => <PriorityBadge priority={p.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: p => <StatusBadge status={p.status} />,
    },
    {
      key: 'progress',
      header: 'Progress',
      className: 'w-36',
      render: p => {
        const prog = calculateProjectProgress(p.id);
        return <ProgressBar progress={prog} showLabel size="sm" />;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right whitespace-nowrap',
      render: p => (
        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/projects/${p.id}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingProject(p);
              setIsFormModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingProject(p)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Project"
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
            Projects Portfolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliver enterprise roadmaps, allocate engineers, and track completion progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setViewMode('grid');
                setPageSize(6);
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setViewMode('table');
                setPageSize(10);
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => exportProjectsToCsv(filteredProjects, 'projects.csv')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-brand-500/20"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SearchBar
            value={search}
            onChange={val => updateFilters('search', val)}
            placeholder="Search projects by title, ID, or description..."
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={['Planning', 'In Progress', 'On Hold', 'Completed', 'Archived']}
            onChange={val => updateFilters('status', val)}
          />

          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            options={['Low', 'Medium', 'High', 'Urgent']}
            onChange={val => updateFilters('priority', val)}
          />
        </div>

        {/* Active Filter Chips */}
        {(search || statusFilter || priorityFilter) && (
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
            <button
              onClick={() => setSearchParams({})}
              className="text-brand-600 hover:text-brand-800 font-semibold underline text-[11px] ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Projects Display: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={p => navigate(`/projects/${p.id}`)}
                onEdit={p => {
                  setEditingProject(p);
                  setIsFormModalOpen(true);
                }}
                onDelete={p => setDeletingProject(p)}
              />
            ))}

            {paginatedProjects.length === 0 && (
              <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                No projects found matching the filter criteria.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedProjects.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={size => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[6, 9, 12, 24]}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <DataTable<Project>
            data={paginatedProjects}
            columns={columns}
            keyExtractor={p => p.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRowClick={p => navigate(`/projects/${p.id}`)}
            emptyMessage="No projects found."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedProjects.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProject(null);
        }}
        initialProject={editingProject}
        onSubmit={async data => {
          if (editingProject) {
            await updateProject(editingProject.id, data);
          } else {
            await createProject(data);
          }
        }}
      />

      {/* Delete Project Confirmation Dialog with Warning for Active Tasks */}
      {deletingProject && (
        <ConfirmDialog
          isOpen={Boolean(deletingProject)}
          onClose={() => setDeletingProject(null)}
          onConfirm={async () => {
            await deleteProject(deletingProject.id);
            setDeletingProject(null);
          }}
          title="Delete Project & Associated Tasks"
          message={`Are you sure you want to permanently delete "${deletingProject.name}" (${deletingProject.id})? All associated tasks will also be deleted.`}
          confirmText="Delete Project"
          variant="danger"
          warnings={
            getActiveTasksForProject(deletingProject.id).length > 0
              ? {
                  title: 'Warning: Active Tasks Will Be Deleted',
                  items: getActiveTasksForProject(deletingProject.id).map(
                    t => `Active Task: ${t.title} (${t.status})`
                  ),
                }
              : undefined
          }
        />
      )}
    </div>
  );
};
