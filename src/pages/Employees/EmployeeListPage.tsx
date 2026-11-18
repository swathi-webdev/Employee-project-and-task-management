import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Employee, EmployeeStatus } from '../../types';
import { useApp } from '../../hooks/useApp';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmployeeFormModal } from '../../components/employees/EmployeeFormModal';
import { exportEmployeesToCsv } from '../../utils/exportCsv';
import { formatDate } from '../../utils/dateUtils';
import { DEPARTMENTS } from '../../data/mockData';
import {
  UserPlus,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal,
  AlertTriangle,
  Building,
  Briefcase
} from 'lucide-react';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    employees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkUpdateEmployeesStatus,
    bulkDeleteEmployees,
    getEmployeeById,
    getEmployeeActiveAssignments,
  } = useApp();

  // Search & Filter state from URL or local
  const search = searchParams.get('search') || '';
  const departmentFilter = searchParams.get('department') || '';
  const designationFilter = searchParams.get('designation') || '';
  const statusFilter = searchParams.get('status') || '';

  // Table pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Confirmation dialogs
  const [deleteDialogData, setDeleteDialogData] = useState<Employee | null>(null);
  const [deactivateWarningData, setDeactivateWarningData] = useState<{
    employee: Employee;
    projects: string[];
    tasks: string[];
  } | null>(null);

  const [bulkActionConfirm, setBulkActionConfirm] = useState<{
    type: 'delete' | 'activate' | 'deactivate';
    count: number;
  } | null>(null);

  // Update query params
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
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase());

      const matchesDept = !departmentFilter || emp.department === departmentFilter;
      const matchesDesig = !designationFilter || emp.designation === designationFilter;
      const matchesStatus = !statusFilter || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesDesig && matchesStatus;
    });
  }, [employees, search, departmentFilter, designationFilter, statusFilter]);

  // Sorting Logic
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let aVal = (a as any)[sortColumn];
      let bVal = (b as any)[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredEmployees, sortColumn, sortDirection]);

  // Paginated data
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(startIndex, startIndex + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedEmployees.length / pageSize) || 1;

  // Sorting Handler
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Selection Handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedEmployees.length && paginatedEmployees.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedEmployees.map(e => e.id));
    }
  };

  // Deactivate check rule
  const handleToggleStatus = (employee: Employee) => {
    if (employee.status === 'Active') {
      const { projects, tasks } = getEmployeeActiveAssignments(employee.id);
      if (projects.length > 0 || tasks.length > 0) {
        setDeactivateWarningData({
          employee,
          projects: projects.map(p => `${p.name} (${p.id})`),
          tasks: tasks.map(t => `${t.title} (${t.id})`),
        });
        return;
      }
      updateEmployee(employee.id, { status: 'Inactive' });
    } else {
      updateEmployee(employee.id, { status: 'Active' });
    }
  };

  // Bulk actions handlers
  const handleBulkActivate = async () => {
    await bulkUpdateEmployeesStatus(selectedIds, 'Active');
    setSelectedIds([]);
    setBulkActionConfirm(null);
  };

  const handleBulkDeactivate = async () => {
    await bulkUpdateEmployeesStatus(selectedIds, 'Inactive');
    setSelectedIds([]);
    setBulkActionConfirm(null);
  };

  const handleBulkDelete = async () => {
    await bulkDeleteEmployees(selectedIds);
    setSelectedIds([]);
    setBulkActionConfirm(null);
  };

  const handleExportSelected = () => {
    const toExport = employees.filter(e => selectedIds.includes(e.id));
    exportEmployeesToCsv(toExport.length > 0 ? toExport : employees, 'employees.csv');
  };

  // Available designations for filtering
  const allDesignations = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => set.add(e.designation));
    return Array.from(set).sort();
  }, [employees]);

  // Define Table Columns
  const columns: Column<Employee>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-slate-500',
    },
    {
      key: 'name',
      header: 'Employee',
      sortable: true,
      render: emp => (
        <div className="flex items-center gap-3">
          <Avatar name={emp.name} src={emp.avatar} size="sm" status={emp.status} />
          <div>
            <div className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
              {emp.name}
            </div>
            <div className="text-xs text-slate-400">{emp.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'text-xs text-slate-500 hidden md:table-cell',
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: emp => (
        <span className="font-medium text-slate-800 text-xs">{emp.department}</span>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      className: 'text-xs text-slate-600 hidden lg:table-cell',
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      sortable: true,
      className: 'text-xs text-slate-500 whitespace-nowrap hidden sm:table-cell',
      render: emp => formatDate(emp.joiningDate),
    },
    {
      key: 'employmentType',
      header: 'Type',
      className: 'text-xs text-slate-500 hidden xl:table-cell',
    },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      className: 'text-xs font-semibold text-slate-800 hidden xl:table-cell',
      render: emp => `$${emp.salary.toLocaleString()}`,
    },
    {
      key: 'reportingManagerId',
      header: 'Manager',
      className: 'text-xs text-slate-500 hidden lg:table-cell',
      render: emp => {
        if (!emp.reportingManagerId) return <span className="text-slate-400 italic">None</span>;
        const manager = getEmployeeById(emp.reportingManagerId);
        return manager ? (
          <span className="font-medium text-slate-700">{manager.name}</span>
        ) : (
          emp.reportingManagerId
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: emp => (
        <button
          onClick={e => {
            e.stopPropagation();
            handleToggleStatus(emp);
          }}
          title="Click to toggle status"
          className="focus:outline-none"
        >
          <StatusBadge status={emp.status} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right whitespace-nowrap',
      render: emp => (
        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/employees/${emp.id}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingEmployee(emp);
              setIsFormModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Employee"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteDialogData(emp)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization personnel, department roles, and compensation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportSelected}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-brand-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={val => updateFilters('search', val)}
            placeholder="Search by name, email, or ID..."
          />

          <FilterDropdown
            label="Department"
            value={departmentFilter}
            options={DEPARTMENTS}
            icon={<Building className="w-3.5 h-3.5" />}
            onChange={val => updateFilters('department', val)}
          />

          <FilterDropdown
            label="Designation"
            value={designationFilter}
            options={allDesignations}
            icon={<Briefcase className="w-3.5 h-3.5" />}
            onChange={val => updateFilters('designation', val)}
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={['Active', 'Inactive']}
            onChange={val => updateFilters('status', val)}
          />
        </div>

        {/* Active Filter Chips */}
        {(search || departmentFilter || designationFilter || statusFilter) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
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
            {departmentFilter && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                Dept: {departmentFilter}
                <button
                  onClick={() => updateFilters('department', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {designationFilter && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Role: {designationFilter}
                <button
                  onClick={() => updateFilters('designation', '')}
                  className="hover:text-rose-500 font-bold ml-0.5"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                Status: {statusFilter}
                <button
                  onClick={() => updateFilters('status', '')}
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

        {/* Bulk Action Controls Bar (visible when items selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-900 animate-in fade-in duration-150">
            <span className="font-semibold">
              {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkActionConfirm({ type: 'activate', count: selectedIds.length })}
                className="px-2.5 py-1 bg-white border border-brand-200 rounded-lg hover:bg-brand-100 font-medium flex items-center gap-1 text-emerald-700"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Activate Selected
              </button>
              <button
                onClick={() => setBulkActionConfirm({ type: 'deactivate', count: selectedIds.length })}
                className="px-2.5 py-1 bg-white border border-brand-200 rounded-lg hover:bg-brand-100 font-medium flex items-center gap-1 text-slate-700"
              >
                <XCircle className="w-3.5 h-3.5" />
                Deactivate Selected
              </button>
              <button
                onClick={() => setBulkActionConfirm({ type: 'delete', count: selectedIds.length })}
                className="px-2.5 py-1 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 font-medium flex items-center gap-1 text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <DataTable<Employee>
          data={paginatedEmployees}
          columns={columns}
          keyExtractor={emp => emp.id}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onRowClick={emp => navigate(`/employees/${emp.id}`)}
          emptyMessage="No employees found matching your criteria."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedEmployees.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={size => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Add / Edit Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        initialEmployee={editingEmployee}
        existingEmployees={employees}
        onSubmit={async data => {
          if (editingEmployee) {
            await updateEmployee(editingEmployee.id, data);
          } else {
            await createEmployee(data);
          }
        }}
      />

      {/* Single Delete Confirmation Dialog */}
      {deleteDialogData && (
        <ConfirmDialog
          isOpen={Boolean(deleteDialogData)}
          onClose={() => setDeleteDialogData(null)}
          onConfirm={async () => {
            if (deleteDialogData) {
              await deleteEmployee(deleteDialogData.id);
              setDeleteDialogData(null);
            }
          }}
          title="Delete Employee Record"
          message={`Are you sure you want to permanently delete ${deleteDialogData.name} (${deleteDialogData.id})? This will also remove them from project team assignments.`}
          confirmText="Delete Record"
          variant="danger"
        />
      )}

      {/* Warning Dialog for Deactivating Employee with Active Assignments */}
      {deactivateWarningData && (
        <ConfirmDialog
          isOpen={Boolean(deactivateWarningData)}
          onClose={() => setDeactivateWarningData(null)}
          onConfirm={async () => {
            await updateEmployee(deactivateWarningData.employee.id, { status: 'Inactive' });
            setDeactivateWarningData(null);
          }}
          title="Warning: Active Assignments Exist"
          message={`Employee ${deactivateWarningData.employee.name} is currently assigned to ongoing projects or tasks. Deactivating will mark them inactive and prevent new project or task assignments.`}
          confirmText="Deactivate Anyway"
          variant="warning"
          warnings={{
            title: 'Active Assignments Found',
            items: [
              ...deactivateWarningData.projects.map(p => `Project: ${p}`),
              ...deactivateWarningData.tasks.map(t => `Task: ${t}`),
            ],
          }}
        />
      )}

      {/* Bulk Action Confirmation */}
      {bulkActionConfirm && (
        <ConfirmDialog
          isOpen={Boolean(bulkActionConfirm)}
          onClose={() => setBulkActionConfirm(null)}
          onConfirm={async () => {
            if (bulkActionConfirm.type === 'delete') await handleBulkDelete();
            else if (bulkActionConfirm.type === 'activate') await handleBulkActivate();
            else if (bulkActionConfirm.type === 'deactivate') await handleBulkDeactivate();
          }}
          title={`Confirm Bulk ${
            bulkActionConfirm.type === 'delete'
              ? 'Deletion'
              : bulkActionConfirm.type === 'activate'
              ? 'Activation'
              : 'Deactivation'
          }`}
          message={`Are you sure you want to ${bulkActionConfirm.type} ${bulkActionConfirm.count} selected employee records?`}
          confirmText={`Confirm ${bulkActionConfirm.type}`}
          variant={bulkActionConfirm.type === 'delete' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};
