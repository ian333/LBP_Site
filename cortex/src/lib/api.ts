/**
 * API Client for Mercuria Cortex
 * This module provides functions to interact with the Cortex API
 * Currently uses mocks but is prepared for real API integration
 */

import type { Tenant, Context, OverviewMetrics } from '../types';
import { mockTenants, getMockContext, getMockMetrics, simulateDelay } from '../mocks/data';

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Flag to use mock data (true for development, false for production)
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

/**
 * Fetch all available tenants
 * Endpoint: GET /api/tenants
 */
export async function fetchTenants(): Promise<Tenant[]> {
  if (USE_MOCKS) {
    await simulateDelay(300);
    return mockTenants;
  }

  const response = await fetch(`${API_BASE_URL}/tenants`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tenants: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch kernel context for a specific tenant
 * Endpoint: GET /api/context?tenant_id=...
 * 
 * @param tenantId - The tenant ID to fetch context for
 */
export async function fetchContext(tenantId: string): Promise<Context> {
  if (USE_MOCKS) {
    await simulateDelay(400);
    return getMockContext(tenantId);
  }

  const response = await fetch(`${API_BASE_URL}/context?tenant_id=${encodeURIComponent(tenantId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch context: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch overview metrics for a specific tenant
 * Endpoint: GET /api/metrics/overview?tenant_id=...
 * 
 * @param tenantId - The tenant ID to fetch metrics for
 */
export async function fetchOverviewMetrics(tenantId: string): Promise<OverviewMetrics> {
  if (USE_MOCKS) {
    await simulateDelay(350);
    return getMockMetrics(tenantId);
  }

  const response = await fetch(`${API_BASE_URL}/metrics/overview?tenant_id=${encodeURIComponent(tenantId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Send a chat message to the Cortex API
 * Endpoint: POST /v1/chat
 * 
 * @param tenantSlug - The tenant slug (e.g., 'demo_tenant')
 * @param sessionId - The session ID for conversation continuity
 * @param message - The user's message
 */
export async function sendChatMessage(
  tenantSlug: string,
  sessionId: string,
  message: string
): Promise<{ response: string; metadata?: { latency_ms: number } }> {
  if (USE_MOCKS) {
    await simulateDelay(800);
    return {
      response: `Respuesta simulada del agente para: "${message}"`,
      metadata: { latency_ms: 800 },
    };
  }

  const response = await fetch(`${API_BASE_URL}/v1/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant: tenantSlug,
      session_id: sessionId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`);
  }
  return response.json();
}
