import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { Task } from '../../types';
import { isTaskOverdue, isTaskUpcoming } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Match tasks due or spanning a day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      try {
        const due = parseISO(task.dueDate);
        return isSameDay(due, day);
      } catch {
        return false;
      }
    });
  };

  const getTaskBadgeStyle = (task: Task, day: Date) => {
    if (task.status === 'Completed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    }
    if (isTaskOverdue(task.dueDate, task.status)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold hover:bg-rose-100';
    }
    if (isToday(day)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold hover:bg-amber-100';
    }
    if (isTaskUpcoming(task.dueDate, task.status)) {
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500">
              Monthly schedule and task due date overview
            </p>
          </div>
        </div>

        {/* Legend & Navigation */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="hidden lg:flex items-center gap-3 text-xs mr-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Overdue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Due Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Completed
            </span>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-50 border-r border-slate-200 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-semibold text-slate-500 py-2.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100">
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[110px] sm:min-h-[125px] p-2 bg-white flex flex-col justify-between transition-colors ${
                !isCurrentMonth ? 'bg-slate-50/60 opacity-50' : ''
              } ${isCurrentDay ? 'bg-blue-50/20' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    isCurrentDay
                      ? 'bg-brand-600 text-white shadow-xs'
                      : isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                )}
              </div>

              {/* Tasks List for this date */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-24">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className={`px-1.5 py-1 rounded text-[11px] border truncate cursor-pointer transition-colors flex items-center gap-1 ${getTaskBadgeStyle(
                      task,
                      day
                    )}`}
                    title={`${task.title} (${task.status})`}
                  >
                    {task.status === 'Completed' && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}

                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-slate-500 font-semibold px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
