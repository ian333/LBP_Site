/**
 * Context View Page - Kernel Memory Inspector
 * Provides detailed view of the kernel context with tabs for different data types
 */

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useKernelContext } from '../../hooks';
import { Tabs, Card, LoadingState, ErrorState, Badge, EmptyState } from '../../components';
import type { Tenant, ChatMessage, Agent, PendingTask, SystemAlert } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

const contextTabs = [
  { id: 'chat', label: 'Chat History' },
  { id: 'agents', label: 'Agents' },
  { id: 'tasks', label: 'Pending Tasks' },
  { id: 'alerts', label: 'System Alerts' },
  { id: 'raw', label: 'Raw JSON' },
];

export function ContextView() {
  const { tenant } = useOutletContext<OutletContext>();
  const { data: context, isLoading, error, refetch } = useKernelContext(tenant.id);
  const [activeTab, setActiveTab] = useState('chat');

  if (isLoading) {
    return <LoadingState message="Cargando contexto..." />;
  }

  if (error) {
    return <ErrorState message="Error al cargar el contexto" onRetry={refetch} />;
  }

  if (!context) {
    return <EmptyState message="No hay datos de contexto disponibles" />;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Context View</h1>
        <p className="text-slate-400 mt-1">Inspector de memoria del kernel para {tenant.name}</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={contextTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'chat' && <ChatHistoryTab messages={context.chat_history} />}
        {activeTab === 'agents' && <AgentsTab agents={context.agents} />}
        {activeTab === 'tasks' && <TasksTab tasks={context.pending_tasks} />}
        {activeTab === 'alerts' && <AlertsTab alerts={context.system_alerts} />}
        {activeTab === 'raw' && <RawJsonTab context={context} />}
      </div>
    </div>
  );
}

// Chat History Tab
function ChatHistoryTab({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0) {
    return <EmptyState message="No hay mensajes en el historial" icon="💬" />;
  }

  return (
    <Card className="max-h-[600px] overflow-y-auto">
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
      </div>
    </Card>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isSystem
            ? 'bg-slate-700 text-slate-300 italic'
            : 'bg-slate-800 text-white'
        }`}
      >
        <div className="text-xs mb-1 opacity-60">
          {message.role === 'user' ? '👤 Usuario' : message.role === 'assistant' ? '🤖 Agente' : '⚙️ Sistema'}
          <span className="ml-2">{formatTime(new Date(message.timestamp))}</span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}

// Agents Tab
function AgentsTab({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return <EmptyState message="No hay agentes registrados" icon="🤖" />;
  }

  const statusColors = {
    idle: 'info',
    running: 'success',
    error: 'error',
  } as const;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Nombre</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Rol</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Propósito</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 px-4 text-sm text-white font-medium">{agent.name}</td>
                <td className="py-3 px-4 text-sm">
                  <Badge variant={agent.role === 'primary' ? 'success' : 'info'}>
                    {agent.role}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">{agent.purpose}</td>
                <td className="py-3 px-4 text-sm">
                  <Badge variant={statusColors[agent.status]}>
                    {agent.status === 'running' ? '▶️ Ejecutando' : agent.status === 'idle' ? '⏸️ Inactivo' : '❌ Error'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Tasks Tab
function TasksTab({ tasks }: { tasks: PendingTask[] }) {
  if (tasks.length === 0) {
    return <EmptyState message="No hay tareas pendientes" icon="✅" />;
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Tarea</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Rol</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Payload</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">Creada</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 px-4 text-sm text-slate-400 font-mono">{task.id}</td>
                <td className="py-3 px-4 text-sm text-white">{task.task}</td>
                <td className="py-3 px-4 text-sm">
                  <Badge variant="info">{task.role}</Badge>
                </td>
                <td className="py-3 px-4 text-sm text-slate-400 font-mono text-xs">
                  {JSON.stringify(task.payload)}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {formatTime(new Date(task.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Alerts Tab
function AlertsTab({ alerts }: { alerts: SystemAlert[] }) {
  if (alerts.length === 0) {
    return <EmptyState message="No hay alertas del sistema" icon="🔔" />;
  }

  const severityVariants = {
    info: 'info',
    warning: 'warning',
    error: 'error',
  } as const;

  return (
    <Card>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${
              alert.severity === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : alert.severity === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={severityVariants[alert.severity]}>
                  {alert.severity === 'error' ? '🔴 Error' : alert.severity === 'warning' ? '🟡 Warning' : '🔵 Info'}
                </Badge>
                <span className="text-xs text-slate-400">{formatTime(new Date(alert.created_at))}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-white">{alert.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Raw JSON Tab
function RawJsonTab({ context }: { context: object }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-400">Contexto completo en JSON</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {collapsed ? 'Expandir' : 'Colapsar'}
        </button>
      </div>
      {!collapsed && (
        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs text-slate-300 max-h-[500px] overflow-y-auto">
          {JSON.stringify(context, null, 2)}
        </pre>
      )}
    </Card>
  );
}

// Helper function to format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
