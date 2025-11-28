/**
 * Custom Hooks for Mercuria Cortex Mission Control
 * These hooks provide reactive data fetching with automatic polling
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTenants, fetchContext, fetchOverviewMetrics } from '../lib/api';
import type { Tenant, Context, OverviewMetrics } from '../types';

// Polling interval in milliseconds (5 seconds)
const POLLING_INTERVAL = 5000;

/**
 * Hook to fetch and cache the list of tenants
 * Tenants are relatively static, so we don't poll for updates
 */
export function useTenants() {
  return useQuery<Tenant[], Error>({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

/**
 * Hook to fetch kernel context for a tenant with automatic polling
 * This is the main hook for getting real-time context data
 * 
 * @param tenantId - The tenant ID to fetch context for
 * 
 * Usage:
 * const { data: context, isLoading, isError, error } = useKernelContext('tenant-1');
 * 
 * The context includes:
 * - chat_history: Conversation history
 * - agents: List of agents and their status
 * - pending_tasks: Tasks waiting to be processed
 * - system_alerts: System notifications
 * - last_db_query_result: Most recent database query result
 * - execution_notes: Notes from agent execution
 */
export function useKernelContext(tenantId: string | null) {
  return useQuery<Context, Error>({
    queryKey: ['context', tenantId],
    queryFn: () => {
      if (!tenantId) throw new Error('No tenant selected');
      return fetchContext(tenantId);
    },
    enabled: !!tenantId, // Only fetch if tenant is selected
    refetchInterval: POLLING_INTERVAL, // Poll every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  });
}

/**
 * Hook to fetch overview metrics for a tenant with automatic polling
 * Provides aggregated data for dashboard visualizations
 * 
 * @param tenantId - The tenant ID to fetch metrics for
 * 
 * Usage:
 * const { data: metrics, isLoading, isError } = useOverviewMetrics('tenant-1');
 * 
 * The metrics include:
 * - activeAgents: Number of agents currently running
 * - pendingTasks: Number of tasks in queue
 * - alertsBySeverity: Breakdown of alerts by severity level
 * - tasksPerHour: Time-series data for task creation
 */
export function useOverviewMetrics(tenantId: string | null) {
  return useQuery<OverviewMetrics, Error>({
    queryKey: ['metrics', tenantId],
    queryFn: () => {
      if (!tenantId) throw new Error('No tenant selected');
      return fetchOverviewMetrics(tenantId);
    },
    enabled: !!tenantId, // Only fetch if tenant is selected
    refetchInterval: POLLING_INTERVAL, // Poll every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  });
}

/**
 * Hook to manually invalidate and refetch context/metrics
 * Useful for forcing a refresh after user actions
 */
export function useRefreshData() {
  const queryClient = useQueryClient();

  return {
    refreshContext: (tenantId: string) => {
      queryClient.invalidateQueries({ queryKey: ['context', tenantId] });
    },
    refreshMetrics: (tenantId: string) => {
      queryClient.invalidateQueries({ queryKey: ['metrics', tenantId] });
    },
    refreshAll: (tenantId: string) => {
      queryClient.invalidateQueries({ queryKey: ['context', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['metrics', tenantId] });
    },
  };
}
