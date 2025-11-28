/**
 * Mock data for Mercuria Cortex Mission Control
 * This file provides simulated data for development and testing
 * until the real backend API is available
 */

import type { Tenant, Context, OverviewMetrics, Agent, PendingTask, SystemAlert, ChatMessage } from '../types';

// Mock tenants
export const mockTenants: Tenant[] = [
  { id: 'tenant-1', name: 'HAAS Industries', slug: 'haas', logoUrl: '/logos/haas.png' },
  { id: 'tenant-2', name: 'Javaz Coffee', slug: 'javaz', logoUrl: '/logos/javaz.png' },
  { id: 'tenant-3', name: 'LoyalBliss Productions', slug: 'loyalbliss', logoUrl: '/logos/loyalbliss.png' },
  { id: 'tenant-4', name: 'Taquería Don Sebas', slug: 'taqueria_don_sebas' },
  { id: 'tenant-5', name: 'Demo Tenant', slug: 'demo_tenant' },
];

// Mock agents
const mockAgents: Agent[] = [
  { id: 'agent-1', role: 'primary', name: 'Coordinator', purpose: 'Orchestrates all agent activities', status: 'running' },
  { id: 'agent-2', role: 'aux', name: 'DataAnalyst', purpose: 'Analyzes data and generates insights', status: 'idle' },
  { id: 'agent-3', role: 'aux', name: 'CustomerService', purpose: 'Handles customer inquiries', status: 'running' },
  { id: 'agent-4', role: 'aux', name: 'InventoryManager', purpose: 'Manages stock and inventory', status: 'idle' },
  { id: 'agent-5', role: 'aux', name: 'ReportGenerator', purpose: 'Creates automated reports', status: 'error' },
];

// Mock pending tasks
const mockPendingTasks: PendingTask[] = [
  { id: 'task-1', task: 'Process order #1234', role: 'CustomerService', payload: { orderId: '1234' }, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'task-2', task: 'Generate weekly report', role: 'ReportGenerator', payload: { type: 'weekly' }, created_at: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'task-3', task: 'Update inventory counts', role: 'InventoryManager', payload: { location: 'warehouse-1' }, created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'task-4', task: 'Analyze sales trends', role: 'DataAnalyst', payload: { period: 'Q4' }, created_at: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'task-5', task: 'Respond to customer inquiry', role: 'CustomerService', payload: { ticketId: 'TKT-789' }, created_at: new Date(Date.now() - 25 * 60000).toISOString() },
];

// Mock system alerts
const mockSystemAlerts: SystemAlert[] = [
  { id: 'alert-1', severity: 'error', message: 'ReportGenerator agent encountered an error', created_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'alert-2', severity: 'warning', message: 'High memory usage detected', created_at: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'alert-3', severity: 'info', message: 'Daily backup completed successfully', created_at: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'alert-4', severity: 'warning', message: 'API rate limit approaching threshold', created_at: new Date(Date.now() - 45 * 60000).toISOString() },
];

// Mock chat history
const mockChatHistory: ChatMessage[] = [
  { role: 'system', content: 'Mercuria Cortex initialized for HAAS Industries', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { role: 'user', content: '¿Cuántos pedidos tenemos pendientes hoy?', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
  { role: 'assistant', content: 'Actualmente hay **12 pedidos pendientes** para hoy. 3 están en proceso de preparación y 9 están esperando confirmación de pago.', timestamp: new Date(Date.now() - 54 * 60000).toISOString() },
  { role: 'user', content: 'Genera un reporte de ventas del último mes', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { role: 'assistant', content: 'He iniciado la generación del reporte de ventas. El agente ReportGenerator está procesando los datos. Te notificaré cuando esté listo.', timestamp: new Date(Date.now() - 39 * 60000).toISOString() },
  { role: 'user', content: '¿Cuál es el estado del inventario?', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  { role: 'assistant', content: 'El inventario actual muestra:\n\n- **Productos críticos (bajo stock):** 5 items\n- **Stock normal:** 234 items\n- **Exceso de stock:** 12 items\n\n¿Deseas ver el detalle de los productos con bajo stock?', timestamp: new Date(Date.now() - 19 * 60000).toISOString() },
];

// Create mock context for a tenant
export function getMockContext(tenantId: string): Context {
  return {
    tenant_id: tenantId,
    chat_history: mockChatHistory,
    agents: mockAgents,
    pending_tasks: mockPendingTasks,
    system_alerts: mockSystemAlerts,
    last_db_query_result: {
      query: 'SELECT COUNT(*) FROM orders WHERE status = "pending"',
      result: [{ count: 12 }],
      executed_at: new Date().toISOString(),
    },
    execution_notes: [
      'Coordinator agent delegated task to DataAnalyst',
      'ReportGenerator encountered timeout, retrying...',
      'CustomerService processed 15 inquiries today',
    ],
  };
}

// Create mock metrics for a tenant
export function getMockMetrics(_tenantId: string): OverviewMetrics {
  // Generate random variation to simulate real-time updates
  const baseActiveAgents = 3;
  const basePendingTasks = 5;
  
  return {
    activeAgents: baseActiveAgents + Math.floor(Math.random() * 2),
    pendingTasks: basePendingTasks + Math.floor(Math.random() * 3),
    alertsBySeverity: [
      { severity: 'info', count: 2 + Math.floor(Math.random() * 3) },
      { severity: 'warning', count: 2 + Math.floor(Math.random() * 2) },
      { severity: 'error', count: 1 + Math.floor(Math.random() * 2) },
    ],
    tasksPerHour: [
      { hour: '00:00', count: 3 + Math.floor(Math.random() * 5) },
      { hour: '04:00', count: 2 + Math.floor(Math.random() * 3) },
      { hour: '08:00', count: 8 + Math.floor(Math.random() * 6) },
      { hour: '12:00', count: 12 + Math.floor(Math.random() * 8) },
      { hour: '16:00', count: 15 + Math.floor(Math.random() * 5) },
      { hour: '20:00', count: 7 + Math.floor(Math.random() * 4) },
    ],
  };
}

// Simulate API delay
export const simulateDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
