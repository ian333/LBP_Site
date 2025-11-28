/**
 * Resources Page - Database/Resources Inspector (Placeholder)
 * Future: Will show database queries, resource usage, and integrations
 */

import { useOutletContext } from 'react-router-dom';
import { Card, EmptyState } from '../../components';
import { Database, Server, Cloud, Settings } from 'lucide-react';
import type { Tenant } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

export function Resources() {
  const { tenant } = useOutletContext<OutletContext>();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Resources / DB Inspector</h1>
        <p className="text-slate-400 mt-1">Recursos e integrations para {tenant.name}</p>
      </div>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex flex-col items-center py-6 text-center">
            <Database className="w-12 h-12 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white">Database</h3>
            <p className="text-sm text-slate-400 mt-1">Query inspector</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center py-6 text-center">
            <Server className="w-12 h-12 text-green-400 mb-3" />
            <h3 className="font-semibold text-white">Cache</h3>
            <p className="text-sm text-slate-400 mt-1">Redis/Memory</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center py-6 text-center">
            <Cloud className="w-12 h-12 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white">External APIs</h3>
            <p className="text-sm text-slate-400 mt-1">Integrations</p>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center py-6 text-center">
            <Settings className="w-12 h-12 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-white">Configuration</h3>
            <p className="text-sm text-slate-400 mt-1">System settings</p>
          </div>
        </Card>
      </div>

      {/* Placeholder content */}
      <Card title="Last Database Query">
        <EmptyState 
          message="Esta funcionalidad estará disponible próximamente" 
          icon="🚧"
        />
      </Card>
    </div>
  );
}
