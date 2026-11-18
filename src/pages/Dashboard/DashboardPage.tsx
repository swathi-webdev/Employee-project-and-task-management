import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import { formatDate, isTaskOverdue, isTaskUpcoming } from '../../utils/dateUtils';
import {
  Users,
  UserCheck,
  Briefcase,
  Layers,
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { employees, projects, tasks, calculateProjectProgress, getEmployeeById } = useApp();

  // Metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  // Overdue tasks
  const overdueTasks = tasks.filter(t => isTaskOverdue(t.dueDate, t.status));

  // Upcoming tasks (due within 7 days)
  const upcomingTasks = tasks
    .filter(t => isTaskUpcoming(t.dueDate, t.status, 7))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Recent employees
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
    .slice(0, 5);

  // Recent projects (ordered 1, 2, 3)
  const recentProjects = [...projects]
    .sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    })
    .slice(0, 4);

  // Department distribution
  const departmentCounts: Record<string, number> = {};
  employees.forEach(emp => {
    departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
  });
  const topDepartment = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Engineering';

  // Project status distribution
  const projectStatusCounts = {
    'In Progress': projects.filter(p => p.status === 'In Progress').length,
    Planning: projects.filter(p => p.status === 'Planning').length,
    'On Hold': projects.filter(p => p.status === 'On Hold').length,
    Completed: projects.filter(p => p.status === 'Completed').length,
  };

  // Task status distribution
  const taskStatusCounts = {
    'To Do': tasks.filter(t => t.status === 'To Do').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Review: tasks.filter(t => t.status === 'Review').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Overdue Alert Banner if any overdue tasks exist */}
      {overdueTasks.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                Action Required: {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''} Detected
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Some tasks have exceeded their scheduled deadlines. Please review and update deadlines or reallocate resources.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-white border border-rose-200 rounded-lg hover:bg-rose-100/50 transition-colors shadow-2xs self-end sm:self-center shrink-0 flex items-center gap-1.5"
          >
            <span>Review Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Staff"
          value={totalEmployees}
          subtitle="All departments"
          icon={Users}
          color="blue"
          onClick={() => navigate('/employees')}
        />
        <StatCard
          title="Active Staff"
          value={activeEmployees}
          subtitle={`${Math.round((activeEmployees / (totalEmployees || 1)) * 100)}% available`}
          icon={UserCheck}
          color="emerald"
          onClick={() => navigate('/employees?status=Active')}
        />
        <StatCard
          title="Projects"
          value={totalProjects}
          subtitle="Portfolio total"
          icon={Briefcase}
          color="indigo"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="In Progress"
          value={activeProjects}
          subtitle="Active delivery"
          icon={Layers}
          color="purple"
          onClick={() => navigate('/projects?status=In Progress')}
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          subtitle="Across sprints"
          icon={CheckSquare}
          color="amber"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          subtitle={`${Math.round((completedTasks / (totalTasks || 1)) * 100)}% done`}
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/tasks?status=Completed')}
        />
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-600" />
                Department Distribution
              </h3>
              <span className="text-xs font-semibold text-slate-400">Headcount</span>
            </div>

            <div className="space-y-3">
              {Object.entries(departmentCounts).map(([dept, count]) => {
                const percentage = Math.round((count / (totalEmployees || 1)) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{dept}</span>
                      <span className="text-slate-500 font-semibold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Largest Team: {topDepartment}</span>
            <button
              onClick={() => navigate('/employees')}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              Directory <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Project Status Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                Project Pipeline Health
              </h3>
              <span className="text-xs font-semibold text-slate-400">Status</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <span className="text-[10px] font-bold text-blue-700 uppercase">In Progress</span>
                <div className="text-2xl font-bold text-blue-950 mt-1">{projectStatusCounts['In Progress']}</div>
              </div>
              <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
                <span className="text-[10px] font-bold text-sky-700 uppercase">Planning</span>
                <div className="text-2xl font-bold text-sky-950 mt-1">{projectStatusCounts['Planning']}</div>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                <span className="text-[10px] font-bold text-amber-700 uppercase">On Hold</span>
                <div className="text-2xl font-bold text-amber-950 mt-1">{projectStatusCounts['On Hold']}</div>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Completed</span>
                <div className="text-2xl font-bold text-emerald-950 mt-1">{projectStatusCounts['Completed']}</div>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(projectStatusCounts['In Progress'] / (totalProjects || 1)) * 100}%` }}
                title="In Progress"
              />
              <div
                className="bg-sky-400 h-full"
                style={{ width: `${(projectStatusCounts['Planning'] / (totalProjects || 1)) * 100}%` }}
                title="Planning"
              />
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${(projectStatusCounts['On Hold'] / (totalProjects || 1)) * 100}%` }}
                title="On Hold"
              />
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${(projectStatusCounts['Completed'] / (totalProjects || 1)) * 100}%` }}
                title="Completed"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{totalProjects} Total Managed Initiatives</span>
            <button
              onClick={() => navigate('/projects')}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              All Projects <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Task Velocity & Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                Sprint Task Distribution
              </h3>
              <span className="text-xs font-semibold text-slate-400">Backlog</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">To Do</span>
                  <span className="font-semibold text-slate-800">{taskStatusCounts['To Do']} tasks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-400 h-full rounded-full"
                    style={{ width: `${(taskStatusCounts['To Do'] / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">In Progress</span>
                  <span className="font-semibold text-slate-800">{taskStatusCounts['In Progress']} tasks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${(taskStatusCounts['In Progress'] / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Review</span>
                  <span className="font-semibold text-slate-800">{taskStatusCounts['Review']} tasks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${(taskStatusCounts['Review'] / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-semibold text-slate-800">{taskStatusCounts['Completed']} tasks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(taskStatusCounts['Completed'] / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Task Completion</span>
            <span className="font-bold text-emerald-600">
              {Math.round((completedTasks / (totalTasks || 1)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Projects & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Projects</h3>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProjects.map(project => {
              const manager = getEmployeeById(project.managerId);
              const progress = calculateProjectProgress(project.id);

              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {project.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 hover:text-brand-600 transition-colors truncate max-w-xs">
                        {project.name}
                      </h4>
                    </div>
                    <PriorityBadge priority={project.priority} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Avatar name={manager?.name || 'M'} src={manager?.avatar} size="xs" />
                      <span>{manager?.name || 'Lead'}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(project.endDate)}
                    </span>
                  </div>

                  <ProgressBar progress={progress} showLabel size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Task Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Upcoming Deadlines</h3>
              <p className="text-[11px] text-slate-400">Tasks due in the next 7 days</p>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Tasks <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingTasks.slice(0, 5).map(task => {
              const assignee = getEmployeeById(task.assignedEmployeeId);

              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks?selected=${task.id}`)}
                  className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/60 rounded-xl px-2 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge priority={task.priority} />
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{task.projectId}</span>
                      <span>•</span>
                      <span>{assignee ? assignee.name : 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-600 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(task.dueDate, 'MMM d')}</span>
                    </div>
                    <StatusBadge status={task.status} size="sm" />
                  </div>
                </div>
              );
            })}

            {upcomingTasks.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 stroke-1 mb-1" />
                No tasks due in the upcoming 7 days.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Employees Table Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Team Members</h3>
            <p className="text-[11px] text-slate-400">Latest additions to the enterprise team</p>
          </div>
          <button
            onClick={() => navigate('/employees')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage Directory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Designation</th>
                <th className="py-2.5 px-3">Joined</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEmployees.map(emp => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} src={emp.avatar} size="xs" status={emp.status} />
                      <div>
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{emp.department}</td>
                  <td className="py-3 px-3 text-slate-600">{emp.designation}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(emp.joiningDate)}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={emp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
