"use client";
import { useState } from "react";
import { Action, Priority, ActionStatus } from "@/lib/types";
import { upsertAction, deleteAction, generateId } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

const EMPTY_ACTION: Omit<Action, "id"> = {
  title: "", priority: "media", dueDate: "", status: "pendiente", responsible: "", notes: "",
};

export default function ActionsSection({ clientId, actions, onChange }: {
  clientId: string; actions: Action[]; onChange: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Action | null>(null);
  const [form, setForm] = useState<Omit<Action, "id">>(EMPTY_ACTION);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_ACTION);
    setModalOpen(true);
  }

  function openEdit(action: Action) {
    setEditing(action);
    setForm({ title: action.title, priority: action.priority, dueDate: action.dueDate, status: action.status, responsible: action.responsible, notes: action.notes || "" });
    setModalOpen(true);
  }

  function save() {
    if (!form.title.trim() || !form.dueDate || !form.responsible.trim()) return;
    const action: Action = { id: editing?.id ?? generateId(), ...form };
    upsertAction(clientId, action);
    onChange();
    setModalOpen(false);
  }

  function confirmDelete(id: string) {
    deleteAction(clientId, id);
    onChange();
    setDeleteConfirm(null);
  }

  const sorted = [...actions].sort((a, b) => {
    const p = { alta: 0, media: 1, baja: 2 };
    return p[a.priority] - p[b.priority] || a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Próximas Acciones</h3>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nueva
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">Sin acciones registradas</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((action) => (
            <div key={action.id} className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm ${action.status === "completada" ? "line-through text-gray-500" : "text-white"}`}>{action.title}</span>
                  <Badge label={action.priority} variant={action.priority} />
                  <Badge label={action.status} variant={action.status} />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(action.dueDate + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {action.responsible}
                  </span>
                </div>
                {action.notes && <p className="text-xs text-gray-600 mt-1 truncate">{action.notes}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(action)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteConfirm(action.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Acción" : "Nueva Acción"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Título *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Describe la acción..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Prioridad</label>
              <select className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Estado</label>
              <select className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ActionStatus })}>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Fecha límite *</label>
              <input type="date" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Responsable *</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Nombre del responsable" value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notas</label>
            <textarea className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm resize-none" rows={3} placeholder="Notas adicionales..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={save} disabled={!form.title.trim() || !form.dueDate || !form.responsible.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">
              {editing ? "Guardar cambios" : "Crear acción"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar acción">
        <p className="text-gray-300 text-sm mb-6">¿Estás seguro de que quieres eliminar esta acción? Esta operación no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
          <button onClick={() => deleteConfirm && confirmDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
