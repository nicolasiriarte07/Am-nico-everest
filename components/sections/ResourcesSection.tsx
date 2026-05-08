"use client";
import React, { useState } from "react";
import { Resource, ResourceType } from "@/lib/types";
import { upsertResource, deleteResource, generateId } from "@/lib/store";
import Modal from "@/components/ui/Modal";

const EMPTY: Omit<Resource, "id"> = { name: "", type: "link", url: "", description: "", addedDate: new Date().toISOString().split("T")[0] };

const TYPE_ICONS: Record<ResourceType, React.ReactElement> = {
  link: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  doc: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  brief: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  otro: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
};

const TYPE_COLORS: Record<ResourceType, string> = {
  link: "text-blue-400 bg-blue-400/10",
  doc: "text-purple-400 bg-purple-400/10",
  brief: "text-amber-400 bg-amber-400/10",
  otro: "text-gray-400 bg-gray-400/10",
};

export default function ResourcesSection({ clientId, resources, onChange }: {
  clientId: string; resources: Resource[]; onChange: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState<Omit<Resource, "id">>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(r: Resource) {
    setEditing(r);
    setForm({ name: r.name, type: r.type, url: r.url, description: r.description || "", addedDate: r.addedDate });
    setModalOpen(true);
  }

  function save() {
    if (!form.name.trim() || !form.url.trim()) return;
    const resource: Resource = { id: editing?.id ?? generateId(), ...form };
    upsertResource(clientId, resource);
    onChange();
    setModalOpen(false);
  }

  function confirmDelete(id: string) { deleteResource(clientId, id); onChange(); setDeleteConfirm(null); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recursos</h3>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo
        </button>
      </div>

      {resources.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">Sin recursos registrados</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {resources.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 transition-colors group">
              <div className={`p-2 rounded-lg shrink-0 ${TYPE_COLORS[r.type]}`}>{TYPE_ICONS[r.type]}</div>
              <div className="flex-1 min-w-0">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-blue-400 transition-colors truncate block">{r.name}</a>
                {r.description && <p className="text-xs text-gray-500 truncate mt-0.5">{r.description}</p>}
                <p className="text-xs text-gray-600 mt-0.5 capitalize">{r.type} · {new Date(r.addedDate + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteConfirm(r.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Recurso" : "Nuevo Recurso"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Nombre del recurso" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
              <select className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}>
                <option value="link">Link</option>
                <option value="doc">Documento</option>
                <option value="brief">Brief</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Fecha</label>
              <input type="date" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.addedDate} onChange={(e) => setForm({ ...form, addedDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">URL *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Descripción</label>
            <textarea className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm resize-none" rows={2} placeholder="Descripción opcional..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={save} disabled={!form.name.trim() || !form.url.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">
              {editing ? "Guardar cambios" : "Crear recurso"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar recurso">
        <p className="text-gray-300 text-sm mb-6">¿Eliminar este recurso permanentemente?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
          <button onClick={() => deleteConfirm && confirmDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
