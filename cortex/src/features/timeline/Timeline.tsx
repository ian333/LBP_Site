/**
 * Timeline Page - Event History
 * Shows a chronological timeline of tasks and alerts
 */

import { useOutletContext } from 'react-router-dom';
import { useKernelContext } from '../../hooks';
import { LoadingState, ErrorState, EmptyState, Badge } from '../../components';
import { ListTodo, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import type { Tenant, PendingTask, SystemAlert } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

type TimelineItem = {
  id: string;
  type: 'task' | 'alert';
  timestamp: Date;
  data: PendingTask | SystemAlert;
};

export function Timeline() {
  const { tenant } = useOutletContext<OutletContext>();
  const { data: context, isLoading, error, refetch } = useKernelContext(tenant.id);

  if (isLoading) {
    return <LoadingState message="Cargando timeline..." />;
  }

  if (error) {
    return <ErrorState message="Error al cargar el timeline" onRetry={refetch} />;
  }

  if (!context) {
    return <EmptyState message="No hay datos disponibles" />;
  }

  // Combine tasks and alerts into a single timeline
  const timelineItems: TimelineItem[] = [
    ...context.pending_tasks.map((task): TimelineItem => ({
      id: `task-${task.id}`,
      type: 'task',
      timestamp: new Date(task.created_at),
      data: task,
    })),
    ...context.system_alerts.map((alert): TimelineItem => ({
      id: `alert-${alert.id}`,
      type: 'alert',
      timestamp: new Date(alert.created_at),
      data: alert,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Timeline</h1>
        <p className="text-slate-400 mt-1">Línea de tiempo de eventos para {tenant.name}</p>
      </div>

      {/* Timeline */}
      {timelineItems.length === 0 ? (
        <EmptyState message="No hay eventos en el timeline" icon="📅" />
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />

          {/* Timeline items */}
          <div className="space-y-4">
            {timelineItems.map((item) => (
              <TimelineItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItemCard({ item }: { item: TimelineItem }) {
  const isTask = item.type === 'task';
  const task = isTask ? (item.data as PendingTask) : null;
  const alert = !isTask ? (item.data as SystemAlert) : null;

  const getIcon = () => {
    if (isTask) {
      return <ListTodo className="w-5 h-5 text-blue-400" />;
    }
    if (alert?.severity === 'error') {
      return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
    if (alert?.severity === 'warning') {
      return <Bell className="w-5 h-5 text-yellow-400" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const getBgColor = () => {
    if (isTask) return 'bg-blue-500/20 border-blue-500/30';
    if (alert?.severity === 'error') return 'bg-red-500/20 border-red-500/30';
    if (alert?.severity === 'warning') return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  const getIconBgColor = () => {
    if (isTask) return 'bg-blue-500/30';
    if (alert?.severity === 'error') return 'bg-red-500/30';
    if (alert?.severity === 'warning') return 'bg-yellow-500/30';
    return 'bg-green-500/30';
  };

  return (
    <div className="flex gap-4 items-start">
      {/* Icon circle */}
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${getIconBgColor()}`}>
        {getIcon()}
      </div>

      {/* Content card */}
      <div className={`flex-1 p-4 rounded-xl border ${getBgColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={isTask ? 'info' : alert?.severity === 'error' ? 'error' : alert?.severity === 'warning' ? 'warning' : 'success'}>
              {isTask ? 'Tarea' : alert?.severity === 'error' ? 'Error' : alert?.severity === 'warning' ? 'Advertencia' : 'Info'}
            </Badge>
            {isTask && task && (
              <span className="text-xs text-slate-400 font-mono">{task.role}</span>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(item.timestamp)}
          </span>
        </div>
        
        <p className="text-sm text-white">
          {isTask ? task?.task : alert?.message}
        </p>

        {isTask && task && Object.keys(task.payload).length > 0 && (
          <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-950/50 rounded px-2 py-1">
            {JSON.stringify(task.payload)}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}
