import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Layout } from './components'
import { Dashboard } from './features/dashboard'
import { ContextView } from './features/context'
import { Timeline } from './features/timeline'
import { Mindmap } from './features/mindmap'
import { Resources } from './features/resources'
import { SystemHealth } from './features/alerts'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="context" element={<ContextView />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="mindmap" element={<Mindmap />} />
            <Route path="resources" element={<Resources />} />
            <Route path="alerts" element={<SystemHealth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
