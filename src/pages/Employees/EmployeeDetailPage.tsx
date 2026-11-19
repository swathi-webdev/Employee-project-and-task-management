import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmployeeFormModal } from '../../components/employees/EmployeeFormModal';
import { formatDate } from '../../utils/dateUtils';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
  UserCheck,
  UserX,
  CheckSquare,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';

export const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getEmployeeById,
    employees,
    updateEmployee,
    deleteEmployee,
    getEmployeeProjects,
    getEmployeeTasks,
    getEmployeeActiveAssignments,
    calculateProjectProgress,
  } = useApp();

  const employee = getEmployeeById(id || '');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateWarning, setShowDeactivateWarning] = useState(false);

  if (!employee) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Employee Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The employee with ID "{id}" could not be found or has been deleted.
        </p>
        <button
          onClick={() => navigate('/employees')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-xs"
        >
          Return to Employee Directory
        </button>
      </div>
    );
  }

  const manager = employee.reportingManagerId
    ? getEmployeeById(employee.reportingManagerId)
    : null;

  const assignedProjects = getEmployeeProjects(employee.id);
  const assignedTasks = getEmployeeTasks(employee.id);

  const handleToggleStatus = () => {
    if (employee.status === 'Active') {
      const { projects, tasks } = getEmployeeActiveAssignments(employee.id);
      if (projects.length > 0 || tasks.length > 0) {
        setShowDeactivateWarning(true);
        return;
      }
      updateEmployee(employee.id, { status: 'Inactive' });
    } else {
      updateEmployee(employee.id, { status: 'Active' });
    }
  };

  const handleDelete = async () => {
    await deleteEmployee(employee.id);
    navigate('/employees');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 shadow-2xs ${
              employee.status === 'Active'
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {employee.status === 'Active' ? (
              <>
                <UserX className="w-3.5 h-3.5 text-slate-500" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activate Employee</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            title="Delete Employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar
            name={employee.name}
            src={employee.avatar}
            size="xl"
            status={employee.status}
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {employee.name}
                  </h1>
                  <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {employee.id}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {employee.designation} • {employee.department}
                </p>

                {/* Assigned Projects near Profile Name */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                  <span className="text-[11px] font-semibold text-slate-400">Projects:</span>
                  {assignedProjects.length > 0 ? (
                    assignedProjects.map(p => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 hover:bg-brand-100 hover:border-brand-300 transition-colors"
                        title={p.name}
                      >
                        <Briefcase className="w-3 h-3 text-brand-500 shrink-0" />
                        <span>{p.name}</span>
                        {p.managerId === employee.id && (
                          <span className="text-[9px] font-bold text-brand-600 bg-white px-1 rounded">Lead</span>
                        )}
                      </Link>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No assigned projects</span>
                  )}
                </div>
              </div>

              <StatusBadge status={employee.status} size="md" />
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${employee.email}`} className="hover:text-brand-600">
                  {employee.email}
                </a>
              </span>

              <span className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{employee.phone}</span>
              </span>

              {employee.address && (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.address}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Employment Info & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employment & Organization Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Employment Details
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Department
              </span>
              <span className="font-bold text-slate-800">{employee.department}</span>
            </div>

            <div className="pt-3 flex justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Designation
              </span>
              <span className="font-bold text-slate-800">{employee.designation}</span>
            </div>

            <div className="pt-3 flex justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Joining Date
              </span>
              <span className="font-bold text-slate-800">
                {formatDate(employee.joiningDate)}
              </span>
            </div>

            <div className="pt-3 flex justify-between">
              <span className="text-slate-500">Employment Type</span>
              <span className="font-bold text-slate-800">{employee.employmentType}</span>
            </div>

            <div className="pt-3 flex justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-400 text-xs">₹</span>
                Compensation / Salary
              </span>
              <span className="font-bold text-slate-900">
                ₹{employee.salary.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-slate-500">Reporting Manager</span>
              {manager ? (
                <Link
                  to={`/employees/${manager.id}`}
                  className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
                >
                  <Avatar name={manager.name} src={manager.avatar} size="xs" />
                  <span>{manager.name}</span>
                </Link>
              ) : (
                <span className="text-slate-400 italic">None (Direct Report)</span>
              )}
            </div>

            <div className="pt-3 flex justify-between items-start gap-4">
              <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Address
              </span>
              <span className="font-semibold text-slate-800 text-right">
                {employee.address || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Projects & Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Projects */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-brand-600" />
                Assigned Projects ({assignedProjects.length})
              </h3>
            </div>

            <div className="space-y-3">
              {assignedProjects.map(proj => {
                const isManager = proj.managerId === employee.id;
                const progress = calculateProjectProgress(proj.id);

                return (
                  <div
                    key={proj.id}
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {proj.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 hover:text-brand-600">
                          {proj.name}
                        </h4>
                        {isManager && (
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
                            Project Lead
                          </span>
                        )}
                      </div>
                      <StatusBadge status={proj.status} size="sm" />
                    </div>

                    <ProgressBar progress={progress} showLabel size="sm" />
                  </div>
                );
              })}

              {assignedProjects.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  Not currently assigned to any active projects.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Assigned Tasks ({assignedTasks.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {assignedTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks?selected=${task.id}`)}
                  className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-400">{task.id}</span>
                      <PriorityBadge priority={task.priority} />
                      <span className="font-semibold text-slate-800 truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Project: {task.projectId}</span>
                      <span>•</span>
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <StatusBadge status={task.status} size="sm" />
                </div>
              ))}

              {assignedTasks.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  No tasks assigned to this employee.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialEmployee={employee}
        existingEmployees={employees}
        onSubmit={async data => {
          await updateEmployee(employee.id, data);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${employee.name}? Their project assignments and tasks will be unassigned.`}
        confirmText="Permanently Delete"
        variant="danger"
      />

      {/* Deactivate Warning */}
      {showDeactivateWarning && (
        <ConfirmDialog
          isOpen={showDeactivateWarning}
          onClose={() => setShowDeactivateWarning(false)}
          onConfirm={async () => {
            await updateEmployee(employee.id, { status: 'Inactive' });
            setShowDeactivateWarning(false);
          }}
          title="Warning: Ongoing Assignments"
          message={`${employee.name} is currently assigned to active projects or tasks. Deactivating will prevent new project or task assignments.`}
          confirmText="Deactivate Anyway"
          variant="warning"
          warnings={{
            title: 'Active Assignments',
            items: [
              ...assignedProjects.map(p => `Project: ${p.name}`),
              ...assignedTasks.map(t => `Task: ${t.title}`),
            ],
          }}
        />
      )}
    </div>
  );
};
