/**
 * Shared UI Components for Mission Control
 * Reusable components used across different views
 */

import type { ReactNode } from 'react';

// Card component for dashboard widgets
interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-xl p-4 ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// Metric Card for displaying single values
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
  blue: 'text-blue-400 bg-blue-500/10',
  green: 'text-green-400 bg-green-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10',
  red: 'text-red-400 bg-red-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
};

export function MetricCard({ title, value, icon, trend, trendValue, color = 'blue' }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && trendValue && (
            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Loading Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin`} />
  );
}

// Loading state for views
export function LoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <Spinner size="lg" />
      <p className="mt-4">{message}</p>
    </div>
  );
}

// Error state for views
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Error al cargar datos', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-lg mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

// Empty state for views
interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ message = 'No hay datos disponibles', icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <div className="text-4xl mb-4">{icon || '📭'}</div>
      <p>{message}</p>
    </div>
  );
}

// Badge component for status indicators
interface BadgeProps {
  children: ReactNode;
  variant: 'info' | 'success' | 'warning' | 'error';
}

const badgeVariants = {
  info: 'bg-blue-500/20 text-blue-400',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
};

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeVariants[variant]}`}>
      {children}
    </span>
  );
}

// Tabs component
interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-slate-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
