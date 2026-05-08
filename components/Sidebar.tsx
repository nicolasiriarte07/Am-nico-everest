"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Client } from "@/lib/types";
import { upsertClient, generateId } from "@/lib/store";
import Modal from "@/components/ui/Modal";

interface SidebarProps {
  clients: Client[];
  onRefresh?: () => void;
}

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16","#f97316","#a855f7"];

export default function Sidebar({ clients, onRefresh }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [newClientModal, setNewClientModal] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", color: "#3b82f6", contactName: "", contactEmail: "", status: "activo" as Client["status"] });

  const activeClients = clients.filter((c) => c.status === "activo").length;
  const totalPending = clients.reduce((sum, c) => sum + c.actions.filter((a) => a.status !== "completada").length, 0);

  function createClient() {
    if (!form.name.trim()) return;
    const newClient: Client = {
      id: generateId(),
      name: form.name,
      industry: form.industry,
      color: form.color,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      status: form.status,
      actions: [],
      resources: [],
      team: [],
      objectives: [],
    };
    upsertClient(newClient);
    setNewClientModal(false);
    setForm({ name: "", industry: "", color: "#3b82f6", contactName: "", contactEmail: "", status: "activo" });
    onRefresh?.();
    router.push(`/clients/${newClient.id}`);
  }

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f1117] border-r border-[#1e2535] flex flex-col z-30 overflow-hidden">
        <div className="px-5 py-5 border-b border-[#1e2535]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">AM Dashboard</p>
              <p className="text-xs text-gray-500 mt-0.5">Account Manager</p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${pathname === "/" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Resumen Global
            {totalPending > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{totalPending}</span>
            )}
          </Link>

          <div className="mt-4 mb-2 px-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Clientes ({activeClients})</p>
            <button onClick={() => setNewClientModal(true)} className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors" title="Nuevo cliente">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          <div className="space-y-0.5">
            {clients.map((client) => {
              const pendingCount = client.actions.filter((a) => a.status !== "completada").length;
              const isActive = pathname === `/clients/${client.id}`;
              return (
                <Link key={client.id} href={`/clients/${client.id}`} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: client.color, opacity: client.status === "pausado" ? 0.4 : 1 }} />
                  <span className="truncate flex-1">{client.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {client.status === "pausado" && <span className="text-xs text-amber-500/60">◐</span>}
                    {client.status === "prospecto" && <span className="text-xs text-cyan-500/60">◇</span>}
                    {pendingCount > 0 && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-400 group-hover:bg-white/15"}`}>{pendingCount}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <button onClick={() => setNewClientModal(true)} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-[#2a3347] hover:border-[#3a4560] text-gray-500 hover:text-gray-300 rounded-xl text-sm transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo cliente
          </button>
        </nav>

        <div className="px-5 py-4 border-t border-[#1e2535]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">LG</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Laura Gómez</p>
              <p className="text-xs text-gray-500 truncate">laura@agencia.com</p>
            </div>
          </div>
        </div>
      </aside>

      <Modal open={newClientModal} onClose={() => setNewClientModal(false)} title="Nuevo Cliente">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Nombre de la empresa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Industria</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="SaaS, Moda..." value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Estado</label>
              <select className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Client["status"] })}>
                <option value="activo">Activo</option>
                <option value="pausado">Pausado</option>
                <option value="prospecto">Prospecto</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contacto</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Nombre del contacto" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email contacto</label>
              <input type="email" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="email@empresa.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? "border-white scale-110" : "border-transparent hover:border-white/50"}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setNewClientModal(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={createClient} disabled={!form.name.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">Crear cliente</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
