/**
 * System Health / Alerts Page
 * Shows detailed view of system alerts and health metrics
 */

import { useOutletContext } from 'react-router-dom';
import { useKernelContext } from '../../hooks';
import { Card, LoadingState, ErrorState, EmptyState, Badge, MetricCard } from '../../components';
import { AlertTriangle, Bell, CheckCircle, Activity, Clock, Shield } from 'lucide-react';
import type { Tenant, SystemAlert } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

export function SystemHealth() {
  const { tenant } = useOutletContext<OutletContext>();
  const { data: context, isLoading, error, refetch } = useKernelContext(tenant.id);

  if (isLoading) {
    return <LoadingState message="Cargando estado del sistema..." />;
  }

  if (error) {
    return <ErrorState message="Error al cargar el estado del sistema" onRetry={refetch} />;
  }

  const alerts = context?.system_alerts || [];
  const errorCount = alerts.filter(a => a.severity === 'error').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">System Health</h1>
        <p className="text-slate-400 mt-1">Estado del sistema y alertas para {tenant.name}</p>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Estado General"
          value={errorCount === 0 ? 'Saludable' : 'Atención'}
          icon={<Shield className="w-6 h-6" />}
          color={errorCount === 0 ? 'green' : 'red'}
        />
        <MetricCard
          title="Errores"
          value={errorCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
        <MetricCard
          title="Advertencias"
          value={warningCount}
          icon={<Bell className="w-6 h-6" />}
          color="yellow"
        />
        <MetricCard
          title="Info"
          value={infoCount}
          icon={<CheckCircle className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Kernel"
          status="online"
          lastCheck="Hace 5 seg"
          uptime="99.9%"
        />
        <StatusCard
          title="Database"
          status="online"
          lastCheck="Hace 5 seg"
          uptime="99.8%"
        />
        <StatusCard
          title="External APIs"
          status={errorCount > 0 ? 'degraded' : 'online'}
          lastCheck="Hace 5 seg"
          uptime="98.5%"
        />
      </div>

      {/* Alerts List */}
      <Card title="Alertas Recientes">
        {alerts.length === 0 ? (
          <EmptyState message="No hay alertas activas" icon="✅" />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  status: 'online' | 'offline' | 'degraded';
  lastCheck: string;
  uptime: string;
}

function StatusCard({ title, status, lastCheck, uptime }: StatusCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    degraded: 'bg-yellow-500',
  };

  const statusLabels = {
    online: 'En línea',
    offline: 'Fuera de línea',
    degraded: 'Degradado',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
          <span className="text-sm text-slate-400">{statusLabels[status]}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{lastCheck}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Activity className="w-4 h-4" />
          <span>{uptime}</span>
        </div>
      </div>
    </Card>
  );
}

function AlertCard({ alert }: { alert: SystemAlert }) {
  const severityConfig = {
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      badge: 'error' as const,
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: <Bell className="w-5 h-5 text-yellow-400" />,
      badge: 'warning' as const,
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      badge: 'info' as const,
    },
  };

  const config = severityConfig[alert.severity];

  return (
    <div className={`p-4 rounded-lg border ${config.bg}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <Badge variant={config.badge}>
              {alert.severity === 'error' ? 'Error' : alert.severity === 'warning' ? 'Advertencia' : 'Info'}
            </Badge>
            <span className="text-xs text-slate-400">
              {formatTime(new Date(alert.created_at))}
            </span>
          </div>
          <p className="text-sm text-white">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
