"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Client } from "@/lib/types";
import { getClients } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

export default function HomePage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => { setClients(getClients()); }, []);

  const allPendingActions = clients.flatMap((c) =>
    c.actions
      .filter((a) => a.status !== "completada")
      .map((a) => ({ ...a, clientName: c.name, clientId: c.id, clientColor: c.color }))
  ).sort((a, b) => {
    const p = { alta: 0, media: 1, baja: 2 };
    return p[a.priority] - p[b.priority] || a.dueDate.localeCompare(b.dueDate);
  });

  const allObjectives = clients.flatMap((c) =>
    c.objectives.map((o) => ({ ...o, clientName: c.name, clientId: c.id, clientColor: c.color }))
  );

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.status === "activo").length,
    pendingActions: allPendingActions.filter((a) => a.status === "pendiente").length,
    inProgressActions: allPendingActions.filter((a) => a.status === "en_progreso").length,
    highPriorityActions: allPendingActions.filter((a) => a.priority === "alta").length,
    totalObjectives: allObjectives.length,
    avgProgress: allObjectives.length > 0
      ? Math.round(allObjectives.reduce((sum, o) => sum + Math.min(100, (o.current / o.target) * 100), 0) / allObjectives.length)
      : 0,
  };

  const urgentActions = allPendingActions.filter((a) => a.priority === "alta").slice(0, 8);
  const topObjectives = allObjectives.slice(0, 6);

  return (
    <div className="flex min-h-screen">
      <Sidebar clients={clients} onRefresh={() => setClients(getClients())} />
      <main className="ml-64 flex-1 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Resumen Global</h1>
            <p className="text-gray-400 text-sm mt-1">Vista consolidada de todos los clientes · {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Clientes Activos", value: stats.activeClients, sub: `de ${stats.totalClients} totales`, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#3b82f6", bg: "from-blue-600/20 to-blue-600/5" },
              { label: "Acciones Pendientes", value: stats.pendingActions, sub: `${stats.inProgressActions} en progreso`, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "#f59e0b", bg: "from-amber-600/20 to-amber-600/5" },
              { label: "Prioridad Alta", value: stats.highPriorityActions, sub: "acciones urgentes", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: "#ef4444", bg: "from-red-600/20 to-red-600/5" },
              { label: "Progreso Objetivos", value: `${stats.avgProgress}%`, sub: `${stats.totalObjectives} objetivos activos`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#10b981", bg: "from-emerald-600/20 to-emerald-600/5" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border border-white/10 rounded-2xl p-5`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                  </div>
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: stat.color + "20" }}>
                    <svg className="w-5 h-5" style={{ color: stat.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-[#161b27] border border-[#2a3347] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Acciones Urgentes</h2>
                <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">{urgentActions.length} de prioridad alta</span>
              </div>
              {urgentActions.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-gray-400 text-sm">Sin acciones urgentes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {urgentActions.map((action) => (
                    <Link key={`${action.clientId}-${action.id}`} href={`/clients/${action.clientId}`} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: action.clientColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{action.title}</p>
                        <p className="text-xs text-gray-500 truncate">{action.clientName} · {action.responsible}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge label={action.status} variant={action.status} />
                        <span className="text-xs text-gray-500">{new Date(action.dueDate + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-5">Clientes</h2>
              <div className="space-y-2">
                {clients.map((client) => {
                  const pending = client.actions.filter((a) => a.status !== "completada").length;
                  return (
                    <Link key={client.id} href={`/clients/${client.id}`} className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: client.color + "30", color: client.color }}>
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{client.name}</p>
                        <p className="text-xs text-gray-500 truncate">{client.industry}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge label={client.status} variant={client.status} />
                        {pending > 0 && <span className="text-xs text-gray-400 bg-white/10 px-1.5 py-0.5 rounded-full">{pending}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Objetivos por Cliente</h2>
              <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">Promedio global: {stats.avgProgress}%</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {topObjectives.map((obj) => {
                const pct = obj.target === 0 ? 0 : Math.min(100, Math.round((obj.current / obj.target) * 100));
                const color = pct >= 90 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 30 ? "#f59e0b" : "#ef4444";
                return (
                  <Link key={`${obj.clientId}-${obj.id}`} href={`/clients/${obj.clientId}`} className="p-4 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: obj.clientColor }} />
                      <p className="text-xs text-gray-500 truncate">{obj.clientName}</p>
                    </div>
                    <p className="text-sm font-semibold text-white mb-3">{obj.metric}</p>
                    <ProgressBar current={obj.current} target={obj.target} color={color} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
