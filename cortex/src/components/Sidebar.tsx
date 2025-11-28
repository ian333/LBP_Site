/**
 * Sidebar Component for Mission Control
 * Provides tenant selection and navigation
 */

import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Eye, 
  Clock, 
  Network, 
  Database, 
  Bell,
  ChevronDown,
  Check
} from 'lucide-react';
import type { Tenant } from '../types';

interface SidebarProps {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  onSelectTenant: (tenant: Tenant) => void;
  isLoading?: boolean;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/context', label: 'Context View', icon: Eye },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/mindmap', label: 'Mindmap', icon: Network },
  { path: '/resources', label: 'Resources / DB', icon: Database },
  { path: '/alerts', label: 'System Health', icon: Bell },
];

export function Sidebar({ tenants, selectedTenant, onSelectTenant, isLoading }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          Mercuria Cortex
        </h1>
        <p className="text-xs text-slate-400 mt-1">Mission Control</p>
      </div>

      {/* Tenant Selector */}
      <div className="p-4 border-b border-slate-700">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
          Tenant
        </label>
        <div className="relative">
          <select
            value={selectedTenant?.id || ''}
            onChange={(e) => {
              const tenant = tenants.find(t => t.id === e.target.value);
              if (tenant) onSelectTenant(tenant);
            }}
            disabled={isLoading}
            className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 pr-8 appearance-none cursor-pointer hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select tenant...</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}

interface TenantBadgeProps {
  tenant: Tenant | null;
}

export function TenantBadge({ tenant }: TenantBadgeProps) {
  if (!tenant) return null;
  
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
      <Check className="w-4 h-4 text-green-500" />
      <span className="text-sm text-white">{tenant.name}</span>
    </div>
  );
}
