"use client";
import { useState } from "react";
import { Objective } from "@/lib/types";
import { upsertObjective, deleteObjective, generateId } from "@/lib/store";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";

const EMPTY: Omit<Objective, "id"> = { metric: "", current: 0, target: 100, unit: "", deadline: "", notes: "" };

export default function ObjectivesSection({ clientId, objectives, onChange }: {
  clientId: string; objectives: Objective[]; onChange: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Objective | null>(null);
  const [form, setForm] = useState<Omit<Objective, "id">>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(o: Objective) {
    setEditing(o);
    setForm({ metric: o.metric, current: o.current, target: o.target, unit: o.unit, deadline: o.deadline, notes: o.notes || "" });
    setModalOpen(true);
  }

  function save() {
    if (!form.metric.trim() || !form.unit.trim() || !form.deadline) return;
    const objective: Objective = { id: editing?.id ?? generateId(), ...form, current: Number(form.current), target: Number(form.target) };
    upsertObjective(clientId, objective);
    onChange();
    setModalOpen(false);
  }

  function confirmDelete(id: string) { deleteObjective(clientId, id); onChange(); setDeleteConfirm(null); }

  function progressColor(pct: number) {
    if (pct >= 90) return "#10b981";
    if (pct >= 60) return "#3b82f6";
    if (pct >= 30) return "#f59e0b";
    return "#ef4444";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Objetivos</h3>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nuevo
        </button>
      </div>

      {objectives.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">Sin objetivos registrados</p>
      ) : (
        <div className="space-y-3">
          {objectives.map((obj) => {
            const pct = obj.target === 0 ? 0 : Math.min(100, Math.round((obj.current / obj.target) * 100));
            const color = progressColor(pct);
            return (
              <div key={obj.id} className="p-3 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{obj.metric}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span>Actual: <span className="text-white font-medium">{obj.current} {obj.unit}</span></span>
                      <span>·</span>
                      <span>Meta: <span className="text-white font-medium">{obj.target} {obj.unit}</span></span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Deadline: {new Date(obj.deadline + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(obj)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(obj.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <ProgressBar current={obj.current} target={obj.target} color={color} />
                {obj.notes && <p className="text-xs text-gray-600 mt-2 italic">{obj.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar Objetivo" : "Nuevo Objetivo"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Métrica *</label>
            <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="Ej: Leads generados, CTR, Ventas..." value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Actual *</label>
              <input type="number" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.current} onChange={(e) => setForm({ ...form, current: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Objetivo *</label>
              <input type="number" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Unidad *</label>
              <input className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="€, %, leads..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
          </div>
          {form.target > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Vista previa del progreso</p>
              <ProgressBar current={Number(form.current)} target={Number(form.target)} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Deadline *</label>
            <input type="date" className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notas</label>
            <textarea className="w-full bg-[#0f1117] border border-[#2a3347] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm resize-none" rows={2} placeholder="Contexto adicional..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
            <button onClick={save} disabled={!form.metric.trim() || !form.unit.trim() || !form.deadline} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors">
              {editing ? "Guardar cambios" : "Crear objetivo"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar objetivo">
        <p className="text-gray-300 text-sm mb-6">¿Eliminar este objetivo permanentemente?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-colors">Cancelar</button>
          <button onClick={() => deleteConfirm && confirmDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
