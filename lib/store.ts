"use client";
import { Client, Action, Resource, TeamMember, Objective } from "./types";
import { INITIAL_CLIENTS } from "./data";

const STORAGE_KEY = "am_dashboard_clients";

export function getClients(): Client[] {
  if (typeof window === "undefined") return INITIAL_CLIENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw) as Client[];
  } catch {
    return INITIAL_CLIENTS;
  }
}

export function saveClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function getClientById(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

function updateClient(clientId: string, updater: (c: Client) => Client): void {
  const clients = getClients().map((c) => (c.id === clientId ? updater(c) : c));
  saveClients(clients);
}

export function upsertAction(clientId: string, action: Action): void {
  updateClient(clientId, (c) => ({
    ...c,
    actions: c.actions.some((a) => a.id === action.id)
      ? c.actions.map((a) => (a.id === action.id ? action : a))
      : [...c.actions, action],
  }));
}

export function deleteAction(clientId: string, actionId: string): void {
  updateClient(clientId, (c) => ({
    ...c,
    actions: c.actions.filter((a) => a.id !== actionId),
  }));
}

export function upsertResource(clientId: string, resource: Resource): void {
  updateClient(clientId, (c) => ({
    ...c,
    resources: c.resources.some((r) => r.id === resource.id)
      ? c.resources.map((r) => (r.id === resource.id ? resource : r))
      : [...c.resources, resource],
  }));
}

export function deleteResource(clientId: string, resourceId: string): void {
  updateClient(clientId, (c) => ({
    ...c,
    resources: c.resources.filter((r) => r.id !== resourceId),
  }));
}

export function upsertTeamMember(clientId: string, member: TeamMember): void {
  updateClient(clientId, (c) => ({
    ...c,
    team: c.team.some((m) => m.id === member.id)
      ? c.team.map((m) => (m.id === member.id ? member : m))
      : [...c.team, member],
  }));
}

export function deleteTeamMember(clientId: string, memberId: string): void {
  updateClient(clientId, (c) => ({
    ...c,
    team: c.team.filter((m) => m.id !== memberId),
  }));
}

export function upsertObjective(clientId: string, objective: Objective): void {
  updateClient(clientId, (c) => ({
    ...c,
    objectives: c.objectives.some((o) => o.id === objective.id)
      ? c.objectives.map((o) => (o.id === objective.id ? objective : o))
      : [...c.objectives, objective],
  }));
}

export function deleteObjective(clientId: string, objectiveId: string): void {
  updateClient(clientId, (c) => ({
    ...c,
    objectives: c.objectives.filter((o) => o.id !== objectiveId),
  }));
}

export function upsertClient(client: Client): void {
  const clients = getClients();
  const exists = clients.some((c) => c.id === client.id);
  saveClients(exists ? clients.map((c) => (c.id === client.id ? client : c)) : [...clients, client]);
}

export function deleteClient(clientId: string): void {
  saveClients(getClients().filter((c) => c.id !== clientId));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
