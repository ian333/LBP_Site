# 🧠 Mercuria Cortex - Mission Control

Panel de control dinámico para Mercuria Cortex, un sistema multi-tenant de administración con visualización en tiempo real del kernel.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

Abre http://localhost:3000

## 🏗️ Stack Técnico

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 7
- **Estilos**: TailwindCSS 4
- **Estado/Datos**: TanStack React Query
- **Gráficas**: Recharts
- **Routing**: React Router DOM
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
cortex/
├── src/
│   ├── components/        # Componentes compartidos (Layout, Sidebar, UI)
│   ├── features/          # Módulos por funcionalidad
│   │   ├── dashboard/     # Vista principal con métricas y gráficas
│   │   ├── context/       # Inspector de memoria del kernel
│   │   ├── timeline/      # Línea de tiempo de eventos
│   │   ├── mindmap/       # Mapa estructural (árbol)
│   │   ├── resources/     # Inspector de DB y recursos
│   │   └── alerts/        # Sistema de salud y alertas
│   ├── hooks/             # Hooks personalizados (useKernelContext, etc.)
│   ├── lib/               # Cliente API y helpers
│   ├── mocks/             # Datos de prueba
│   └── types/             # Definiciones TypeScript
├── index.html
└── vite.config.ts
```

## 🎯 Vistas Disponibles

### Dashboard (/)
- Tarjetas con métricas de agentes, tareas y alertas
- Gráfica de barras: Tareas por hora
- Gráfica de pie: Alertas por severidad
- Tabla de tareas recientes

### Context View (/context)
- Chat History: Historial de conversación con burbujas
- Agents: Tabla de agentes y su estado
- Pending Tasks: Lista de tareas en cola
- System Alerts: Alertas del sistema
- Raw JSON: Contexto completo en formato JSON

### Timeline (/timeline)
- Línea de tiempo vertical con tareas y alertas
- Actualización en tiempo real via polling

### Mindmap (/mindmap)
- Visualización en árbol de la estructura del tenant
- Muestra agentes, recursos y procesos

### System Health (/alerts)
- Estado general del sistema
- Métricas de salud
- Lista detallada de alertas

## 🔌 Integración con API

### Endpoints esperados

- `GET /api/tenants` - Lista de tenants
- `GET /api/context?tenant_id=...` - Contexto del kernel
- `GET /api/metrics/overview?tenant_id=...` - Métricas agregadas

### Configuración

```env
VITE_API_URL=/api          # URL base de la API
VITE_USE_MOCKS=true        # Usar datos mock (default: true)
```

### Polling

Los hooks hacen polling automático cada 5 segundos para mantener los datos actualizados.

## 🎨 Hooks Principales

```typescript
// Obtener lista de tenants
const { data: tenants } = useTenants();

// Obtener contexto del kernel (con polling)
const { data: context, isLoading, isError } = useKernelContext(tenantId);

// Obtener métricas (con polling)
const { data: metrics } = useOverviewMetrics(tenantId);

// Refrescar datos manualmente
const { refreshAll } = useRefreshData();
refreshAll(tenantId);
```

## 🔮 Preparado para el Futuro

### DashboardSchema

El frontend está preparado para recibir un schema desde el backend que defina dinámicamente los widgets:

```typescript
type DashboardSchema = {
  widgets: Array<{
    type: 'metric_card' | 'chart' | 'table' | 'timeline';
    title: string;
    dataSource: string;
    config?: Record<string, any>;
  }>;
};
```

### GraphSchema

La vista de Mindmap puede recibir un schema de grafo:

```typescript
type GraphSchema = {
  root: GraphNode;
};
```

## 🛠️ Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run lint     # Linter
npm run preview  # Preview del build
```

## 📝 Notas de Desarrollo

- Los datos son simulados con mocks hasta conectar con el backend real
- El polling se detiene automáticamente cuando no hay tenant seleccionado
- El tenant se puede especificar via URL: `?tenant=demo_tenant`
- Dark mode por defecto, optimizado para operaciones
