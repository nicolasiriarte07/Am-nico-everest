"use client";
import { useState } from "react";
import { TeamMember } from "@/lib/types";
import { upsertTeamMember, deleteTeamMember, generateId } from "@/lib/store";
import Modal from "@/components/ui/Modal";

const EMPTY: Omit<TeamMember, "id"> = { name: "", role: "", email: "" };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#84cc16"];

export default function TeamSection({ clientId, team, onChange }: {
  clientId: string; team: TeamMember[]; onChange: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, "id">>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(m: TeamMember) {
    setEditing(m);
    setForm({ name: m.name, role: m.role, email: m.email });
    setModalOpen(true);
  }

  function save() {
    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) return;
    const member: TeamMember = { id: editing?.id ?? generateId(), ...form };
    upsertTeamMember(clientId, member);
    onChange();
    setModalOpen(false);
  }

  function confirmDelete(id: string) { deleteTeamMember(clientId, id); onChange(); setDeleteConfirm(null); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Equipo</h3>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Agregar
        </button>
      </div>

      {team.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">Sin miembros de equipo</p>
      ) : (
        <div className="space-y-2">
          {team.map((member, i) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 transition-colors group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {initials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{member.name}</p>
                <p className="text-xs text-gray-400 truncate">{member.role}</p>
                <a href={`mailto:${member.email}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate block">{member.email}</a>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(member)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteConfirm(member.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Miembro" : "Agregar al Equipo"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre completo *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Nombre del miembro" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Ej: Account Manager, Diseñador..." value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
            <input type="email" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="email@agencia.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={save} disabled={!form.name.trim() || !form.role.trim() || !form.email.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">
              {editing ? "Guardar cambios" : "Agregar miembro"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar miembro">
        <p className="text-gray-300 text-sm mb-6">¿Eliminar este miembro del equipo?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
          <button onClick={() => deleteConfirm && confirmDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
