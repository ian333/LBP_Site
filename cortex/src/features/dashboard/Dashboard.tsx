/**
 * Dashboard Page - Mission Control Overview
 * Shows metrics, charts, and recent activity for the selected tenant
 */

import { useOutletContext } from 'react-router-dom';
import { Users, ListTodo, AlertTriangle, Activity } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useKernelContext, useOverviewMetrics } from '../../hooks';
import { MetricCard, Card, LoadingState, ErrorState } from '../../components';
import type { Tenant, PendingTask } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

// Colors for the pie chart
const SEVERITY_COLORS = {
  info: '#3b82f6',
  warning: '#eab308',
  error: '#ef4444',
};

export function Dashboard() {
  const { tenant } = useOutletContext<OutletContext>();
  const { data: context, isLoading: contextLoading, error: contextError, refetch: refetchContext } = useKernelContext(tenant.id);
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useOverviewMetrics(tenant.id);

  if (contextLoading || metricsLoading) {
    return <LoadingState message="Cargando dashboard..." />;
  }

  if (contextError || metricsError) {
    return (
      <ErrorState 
        message="Error al cargar el dashboard" 
        onRetry={() => {
          refetchContext();
          refetchMetrics();
        }} 
      />
    );
  }

  const alertsData = metrics?.alertsBySeverity.map(item => ({
    name: item.severity === 'info' ? 'Info' : item.severity === 'warning' ? 'Advertencia' : 'Error',
    value: item.count,
    color: SEVERITY_COLORS[item.severity as keyof typeof SEVERITY_COLORS],
  })) || [];

  const tasksData = metrics?.tasksPerHour || [];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Vista general del sistema para {tenant.name}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Agentes Activos"
          value={metrics?.activeAgents || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Tareas Pendientes"
          value={metrics?.pendingTasks || 0}
          icon={<ListTodo className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Alertas Críticas"
          value={context?.system_alerts.filter(a => a.severity === 'error').length || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
        <MetricCard
          title="Mensajes de Chat"
          value={context?.chat_history.length || 0}
          icon={<Activity className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks per Hour Chart */}
        <Card title="Tareas por Hora">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tareas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerts by Severity Chart */}
        <Card title="Alertas por Severidad">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {alertsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Tasks Table */}
      <Card title="Tareas Recientes">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Tarea</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Rol</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Creada</th>
              </tr>
            </thead>
            <tbody>
              {context?.pending_tasks.slice(0, 10).map((task: PendingTask) => (
                <tr key={task.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-sm text-white">{task.task}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{task.role}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {formatRelativeTime(new Date(task.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!context?.pending_tasks || context.pending_tasks.length === 0) && (
            <div className="py-8 text-center text-slate-400">
              No hay tareas pendientes
            </div>
          )}
        </div>
      </Card>
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
  return `Hace ${diffDays}d`;
}
