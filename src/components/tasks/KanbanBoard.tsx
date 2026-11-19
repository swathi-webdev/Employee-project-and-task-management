import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types';
import { useApp } from '../../hooks/useApp';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const getHeaderColor = () => {
    switch (status) {
      case 'To Do':
        return 'border-t-slate-400';
      case 'In Progress':
        return 'border-t-blue-500';
      case 'Review':
        return 'border-t-purple-500';
      case 'Completed':
        return 'border-t-emerald-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      id={`kanban-col-${status.toLowerCase().replace(/\s+/g, '-')}`}
      className={`flex flex-col w-[85vw] max-w-[340px] sm:w-auto sm:min-w-[260px] lg:min-w-[240px] xl:min-w-[280px] shrink-0 sm:shrink sm:flex-1 snap-center snap-always bg-slate-100/70 rounded-2xl border border-slate-200/80 border-t-4 ${getHeaderColor()} p-3 transition-colors ${
        isOver ? 'bg-brand-50/60 ring-2 ring-brand-300' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {status}
          </h3>
          <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shadow-2xs">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
          title={`Add task to ${status}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards list */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[150px] p-0.5">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}

        {tasks.length === 0 && (
          <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-xs text-slate-400 select-none">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { optimisticMoveTaskStatus } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedMobileCol, setSelectedMobileCol] = useState<TaskStatus | 'All'>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Completed'];

  const scrollToColumn = (status: TaskStatus) => {
    setSelectedMobileCol(status);
    const colId = `kanban-col-${status.toLowerCase().replace(/\s+/g, '-')}`;
    const el = document.getElementById(colId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = String(active.id);
    const targetStatus = String(over.id) as TaskStatus;

    if (!columns.includes(targetStatus)) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      await optimisticMoveTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mobile Column Quick Switcher Pills */}
      <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {columns.map(status => {
          const count = tasks.filter(t => t.status === status).length;
          const isSelected = selectedMobileCol === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => scrollToColumn(status)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-3xs ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-4 pt-1 items-start touch-pan-x"
        >
          {columns.map(colStatus => (
            <KanbanColumn
              key={colStatus}
              status={colStatus}
              tasks={tasks.filter(t => t.status === colStatus)}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onClick={() => {}} isDraggingOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
