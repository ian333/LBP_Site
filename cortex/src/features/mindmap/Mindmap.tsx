/**
 * Mindmap Page - Structural Map
 * Displays a tree-based visualization of the tenant structure
 * 
 * Future-ready: This component is designed to accept a GraphSchema from the backend
 * to dynamically render the organizational structure
 */

import { useOutletContext } from 'react-router-dom';
import { useKernelContext } from '../../hooks';
import { LoadingState, ErrorState, EmptyState, Badge } from '../../components';
import { Building2, Users, Bot, Database, Workflow, ChevronRight } from 'lucide-react';
import type { Tenant, Agent, GraphNode } from '../../types';

interface OutletContext {
  tenant: Tenant;
}

export function Mindmap() {
  const { tenant } = useOutletContext<OutletContext>();
  const { data: context, isLoading, error, refetch } = useKernelContext(tenant.id);

  if (isLoading) {
    return <LoadingState message="Cargando estructura..." />;
  }

  if (error) {
    return <ErrorState message="Error al cargar la estructura" onRetry={refetch} />;
  }

  if (!context) {
    return <EmptyState message="No hay datos disponibles" />;
  }

  // Build the graph structure from context
  // In the future, this could come from a backend-provided GraphSchema
  const graphData: GraphNode = {
    id: 'root',
    type: 'tenant',
    label: tenant.name,
    children: [
      {
        id: 'agents-group',
        type: 'agent',
        label: 'Agents',
        children: context.agents.map(agent => ({
          id: agent.id,
          type: 'agent' as const,
          label: agent.name,
          data: { role: agent.role, status: agent.status, purpose: agent.purpose },
        })),
      },
      {
        id: 'resources-group',
        type: 'resource',
        label: 'Resources',
        data: { placeholder: true },
        children: [
          { id: 'db-resource', type: 'resource' as const, label: 'Database' },
          { id: 'api-resource', type: 'resource' as const, label: 'External APIs' },
          { id: 'cache-resource', type: 'resource' as const, label: 'Cache Layer' },
        ],
      },
      {
        id: 'processes-group',
        type: 'process',
        label: 'Processes',
        data: { placeholder: true },
        children: [
          { id: 'task-processor', type: 'process' as const, label: 'Task Processor' },
          { id: 'event-handler', type: 'process' as const, label: 'Event Handler' },
          { id: 'scheduler', type: 'process' as const, label: 'Scheduler' },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mindmap</h1>
        <p className="text-slate-400 mt-1">Mapa estructural de {tenant.name}</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-slate-400">Tenant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-slate-400">Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-slate-400">Resource</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-slate-400">Process</span>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 overflow-x-auto">
        <TreeNode node={graphData} isRoot />
      </div>

      {/* Future Integration Note */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <p className="text-xs text-slate-400">
          <strong>Nota:</strong> Esta visualización está preparada para recibir un <code className="text-blue-400">GraphSchema</code> desde 
          el backend de Mercuria Cortex. Actualmente muestra una estructura generada a partir del contexto del kernel.
        </p>
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: GraphNode;
  isRoot?: boolean;
  level?: number;
}

function TreeNode({ node, isRoot = false, level = 0 }: TreeNodeProps) {
  const getNodeStyles = () => {
    switch (node.type) {
      case 'tenant':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'agent':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'resource':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'process':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case 'tenant':
        return <Building2 className="w-5 h-5" />;
      case 'agent':
        return <Bot className="w-5 h-5" />;
      case 'resource':
        return <Database className="w-5 h-5" />;
      case 'process':
        return <Workflow className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const agentData = node.data as Agent | undefined;
  const isAgentNode = node.type === 'agent' && agentData?.status;

  return (
    <div className="flex flex-col">
      {/* Node */}
      <div 
        className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border ${getNodeStyles()} ${isRoot ? 'text-lg font-semibold' : ''}`}
        style={{ marginLeft: level * 32 }}
      >
        {getIcon()}
        <span>{node.label}</span>
        
        {/* Agent status badge */}
        {isAgentNode && (
          <Badge 
            variant={
              agentData?.status === 'running' ? 'success' : 
              agentData?.status === 'error' ? 'error' : 
              'info'
            }
          >
            {agentData?.status}
          </Badge>
        )}

        {/* Role badge for agents */}
        {isAgentNode && agentData?.role && (
          <Badge variant={agentData.role === 'primary' ? 'warning' : 'info'}>
            {agentData.role}
          </Badge>
        )}
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className="mt-2 pl-8 border-l-2 border-slate-700 ml-6">
          <div className="space-y-2 py-2">
            {node.children.map((child) => (
              <div key={child.id} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-slate-600 mr-2" />
                <TreeNode node={child} level={0} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
