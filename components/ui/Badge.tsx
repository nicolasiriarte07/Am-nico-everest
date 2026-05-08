interface BadgeProps {
  label: string;
  variant: "alta" | "media" | "baja" | "pendiente" | "en_progreso" | "completada" | "activo" | "pausado" | "prospecto" | "neutral";
}

const VARIANTS: Record<string, string> = {
  alta: "bg-red-500/20 text-red-400 border border-red-500/30",
  media: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  baja: "bg-green-500/20 text-green-400 border border-green-500/30",
  pendiente: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  en_progreso: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  completada: "bg-green-500/20 text-green-400 border border-green-500/30",
  activo: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  pausado: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  prospecto: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  neutral: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const LABELS: Record<string, string> = {
  alta: "Alta", media: "Media", baja: "Baja",
  pendiente: "Pendiente", en_progreso: "En Progreso", completada: "Completada",
  activo: "Activo", pausado: "Pausado", prospecto: "Prospecto",
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant] || VARIANTS.neutral}`}>
      {LABELS[variant] || label}
    </span>
  );
}
