/**
 * Type definitions for Mercuria Cortex Mission Control
 * These types define the data structures used throughout the application
 */

// Tenant represents a customer/organization using the platform
export type Tenant = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
};

// Agent represents an AI agent in the Cortex system
export type Agent = {
  id: string;
  role: 'primary' | 'aux';
  name: string;
  purpose: string;
  status: 'idle' | 'running' | 'error';
};

// PendingTask represents a task waiting to be processed
export type PendingTask = {
  id: string;
  task: string;
  role: string;
  payload: Record<string, unknown>;
  created_at: string;
};

// SystemAlert represents system-level notifications
export type SystemAlert = {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  created_at: string;
};

// ChatMessage represents a message in the conversation history
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

// Context represents the complete kernel context for a tenant
export type Context = {
  tenant_id: string;
  chat_history: ChatMessage[];
  agents: Agent[];
  pending_tasks: PendingTask[];
  system_alerts: SystemAlert[];
  last_db_query_result?: Record<string, unknown>;
  execution_notes?: string[];
};

// OverviewMetrics represents aggregated metrics for the dashboard
export type OverviewMetrics = {
  activeAgents: number;
  pendingTasks: number;
  alertsBySeverity: { severity: string; count: number }[];
  tasksPerHour: { hour: string; count: number }[];
};

/**
 * Future-ready: DashboardSchema for IA-driven UI
 * This type defines how the backend/IA can send a schema to dynamically render the dashboard
 */
export type DashboardWidget = {
  type: 'metric_card' | 'chart' | 'table' | 'timeline';
  title: string;
  dataSource: string; // e.g., 'context.pending_tasks', 'metrics.tasksPerHour'
  config?: Record<string, unknown>;
};

export type DashboardSchema = {
  widgets: DashboardWidget[];
};

/**
 * Future-ready: GraphSchema for Mindmap/Graph visualization
 * This type defines how the backend can send graph structure for visualization
 */
export type GraphNode = {
  id: string;
  type: 'tenant' | 'agent' | 'resource' | 'process';
  label: string;
  data?: Record<string, unknown>;
  children?: GraphNode[];
};

export type GraphSchema = {
  root: GraphNode;
};
