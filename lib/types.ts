export type Priority = "alta" | "media" | "baja";
export type ActionStatus = "pendiente" | "en_progreso" | "completada";
export type ResourceType = "link" | "doc" | "brief" | "otro";

export interface Action {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  status: ActionStatus;
  responsible: string;
  notes?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
  description?: string;
  addedDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface Objective {
  id: string;
  metric: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  color: string;
  contactName: string;
  contactEmail: string;
  status: "activo" | "pausado" | "prospecto";
  actions: Action[];
  resources: Resource[];
  team: TeamMember[];
  objectives: Objective[];
}
