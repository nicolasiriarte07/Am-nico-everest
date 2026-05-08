"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Client } from "@/lib/types";
import { getClients, upsertClient, deleteClient, generateId } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ActionsSection from "@/components/sections/ActionsSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import TeamSection from "@/components/sections/TeamSection";
import ObjectivesSection from "@/components/sections/ObjectivesSection";

type TabKey = "acciones" | "recursos" | "equipo" | "objetivos";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "acciones", label: "Próximas Acciones", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { key: "recursos", label: "Recursos", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { key: "equipo", label: "Equipo", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { key: "objetivos", label: "Objetivos", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const EMPTY_CLIENT: Omit<Client, "id" | "actions" | "resources" | "team" | "objectives"> = {
  name: "", industry: "", color: "#3b82f6", contactName: "", contactEmail: "", status: "activo",
};

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("acciones");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState<Omit<Client, "id" | "actions" | "resources" | "team" | "objectives">>(EMPTY_CLIENT);

  const reload = useCallback(() => {
    const all = getClients();
    setClients(all);
    const found = all.find((c) => c.id === params.id);
    setClient(found ?? null);
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);

  function openEdit() {
    if (!client) return;
    setEditForm({ name: client.name, industry: client.industry, color: client.color, contactName: client.contactName, contactEmail: client.contactEmail, status: client.status });
    setEditModalOpen(true);
  }

  function saveEdit() {
    if (!client || !editForm.name.trim()) return;
    upsertClient({ ...client, ...editForm });
    reload();
    setEditModalOpen(false);
  }

  function confirmDelete() {
    if (!client) return;
    deleteClient(client.id);
    router.push("/");
  }

  if (!client) {
    return (
      <div className="flex min-h-screen">
        <Sidebar clients={clients} onRefresh={reload} />
        <main className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Cliente no encontrado</p>
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">Volver al inicio</Link>
          </div>
        </main>
      </div>
    );
  }

  const pendingCount = client.actions.filter((a) => a.status === "pendiente").length;
  const inProgressCount = client.actions.filter((a) => a.status === "en_progreso").length;
  const completedCount = client.actions.filter((a) => a.status === "completada").length;
  const avgObjectiveProgress = client.objectives.length > 0
    ? Math.round(client.objectives.reduce((sum, o) => sum + Math.min(100, (o.current / o.target) * 100), 0) / client.objectives.length)
    : 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar clients={clients} onRefresh={reload} />
      <main className="ml-64 flex-1 min-h-screen">
        <div className="border-b border-[#1e2535] bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-20 px-8 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: client.color + "30", color: client.color }}>
                {client.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white truncate">{client.name}</h1>
                  <Badge label={client.status} variant={client.status} />
                </div>
                <p className="text-sm text-gray-400 truncate">{client.industry} · {client.contactName} · <a href={`mailto:${client.contactEmail}`} className="hover:text-blue-400 transition-colors">{client.contactEmail}</a></p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={openEdit} className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar
              </button>
              <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Pendientes", value: pendingCount, color: "#f59e0b" },
              { label: "En Progreso", value: inProgressCount, color: "#8b5cf6" },
              { label: "Completadas", value: completedCount, color: "#10b981" },
              { label: "Progreso Obj.", value: `${avgObjectiveProgress}%`, color: "#3b82f6" },
            ].map((s) => (
              <div key={s.label} className="bg-[#161b27] border border-[#2a3347] rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: s.color }} />
                <div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 mb-6 bg-[#161b27] border border-[#2a3347] rounded-xl p-1">
            {TABS.map((tab) => {
              const count = tab.key === "acciones" ? client.actions.length : tab.key === "recursos" ? client.resources.length : tab.key === "equipo" ? client.team.length : client.objectives.length;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-white/15 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} /></svg>
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-6 min-h-64">
            {activeTab === "acciones" && <ActionsSection clientId={client.id} actions={client.actions} onChange={reload} />}
            {activeTab === "recursos" && <ResourcesSection clientId={client.id} resources={client.resources} onChange={reload} />}
            {activeTab === "equipo" && <TeamSection clientId={client.id} team={client.team} onChange={reload} />}
            {activeTab === "objetivos" && <ObjectivesSection clientId={client.id} objectives={client.objectives} onChange={reload} />}
          </div>
        </div>
      </main>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Cliente">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Industria</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="SaaS, Moda, Salud..." value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Estado</label>
              <select className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Client["status"] })}>
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
                <option value="prospecto">Prospecto</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contacto</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" value={editForm.contactName} onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email contacto</label>
              <input type="email" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" value={editForm.contactEmail} onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Color del cliente</label>
            <div className="flex items-center gap-3">
              <input type="color" className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2a3347]" value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} />
              <div className="flex gap-2">
                {["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#f97316","#a855f7"].map((c) => (
                  <button key={c} onClick={() => setEditForm({ ...editForm, color: c })} className={`w-6 h-6 rounded-full border-2 transition-all ${editForm.color === c ? "border-white scale-110" : "border-transparent hover:border-white/50"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={saveEdit} disabled={!editForm.name.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">Guardar cambios</button>
          </div>
        </div>
      </Modal>

      <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Eliminar cliente">
        <p className="text-gray-300 text-sm mb-2">¿Estás seguro de que quieres eliminar a <strong className="text-white">{client.name}</strong>?</p>
        <p className="text-gray-500 text-xs mb-6">Se eliminarán todas sus acciones, recursos, equipo y objetivos. Esta operación no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
          <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors">Eliminar cliente</button>
        </div>
      </Modal>
    </div>
  );
}
