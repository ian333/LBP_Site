/**
 * Main Layout Shell for Mission Control
 * Provides the overall structure with sidebar, header, and content area
 */

import { useState, useMemo, useCallback } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTenants } from '../hooks';
import type { Tenant } from '../types';

export function Layout() {
  const [searchParams] = useSearchParams();
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants();
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Determine the active tenant based on URL param, selection, or default
  const selectedTenant = useMemo(() => {
    if (tenants.length === 0) return null;
    
    // First, check URL param
    const tenantSlug = searchParams.get('tenant');
    if (tenantSlug) {
      const fromUrl = tenants.find(t => t.slug === tenantSlug);
      if (fromUrl) return fromUrl;
    }
    
    // Then, check if we have a selected tenant ID
    if (selectedTenantId) {
      const selected = tenants.find(t => t.id === selectedTenantId);
      if (selected) return selected;
    }
    
    // Default to first tenant
    return tenants[0];
  }, [searchParams, tenants, selectedTenantId]);

  const handleSelectTenant = useCallback((tenant: Tenant) => {
    setSelectedTenantId(tenant.id);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar
        tenants={tenants}
        selectedTenant={selectedTenant}
        onSelectTenant={handleSelectTenant}
        isLoading={tenantsLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header tenant={selectedTenant} />
        
        <main className="flex-1 overflow-auto p-6 bg-slate-950">
          {selectedTenant ? (
            <Outlet context={{ tenant: selectedTenant }} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-400">
                <p className="text-xl mb-2">👆 Selecciona un tenant</p>
                <p className="text-sm">para comenzar a monitorear el sistema</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
