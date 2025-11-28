/**
 * Header Component for Mission Control
 * Shows tenant status and system health indicators
 */

import { useKernelContext, useOverviewMetrics } from '../hooks';
import type { Tenant } from '../types';
import { Activity, Users, ListTodo, AlertTriangle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  tenant: Tenant | null;
}

export function Header({ tenant }: HeaderProps) {
  const { data: context, isRefetching } = useKernelContext(tenant?.id || null);
  const { data: metrics, isLoading: metricsLoading } = useOverviewMetrics(tenant?.id || null);

  const activeAgents = metrics?.activeAgents ?? 0;
  const pendingTasks = metrics?.pendingTasks ?? 0;
  const criticalAlerts = context?.system_alerts.filter(a => a.severity === 'error').length ?? 0;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 px-6 flex items-center justify-between">
      {/* Left: Tenant Name */}
      <div className="flex items-center gap-4">
        {tenant ? (
          <h2 className="text-lg font-semibold text-white">{tenant.name}</h2>
        ) : (
          <h2 className="text-lg text-slate-400">No tenant selected</h2>
        )}
        
        {/* Refresh indicator */}
        {isRefetching && (
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
        )}
      </div>

      {/* Right: Status indicators */}
      {tenant && (
        <div className="flex items-center gap-6">
          {/* Kernel Status */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-300">Kernel OK</span>
          </div>

          {/* Active Agents */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">
              {metricsLoading ? '...' : `${activeAgents} agentes activos`}
            </span>
          </div>

          {/* Pending Tasks */}
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-300">
              {metricsLoading ? '...' : `${pendingTasks} tareas en cola`}
            </span>
          </div>

          {/* Critical Alerts */}
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-400">
                {criticalAlerts} alerta{criticalAlerts > 1 ? 's' : ''} crítica{criticalAlerts > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
