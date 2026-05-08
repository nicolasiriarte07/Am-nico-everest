import { Client } from "./types";

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "1",
    name: "TechVision Corp",
    industry: "SaaS / Tecnología",
    color: "#3b82f6",
    contactName: "Andrés Morales",
    contactEmail: "a.morales@techvision.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Enviar propuesta Q3 redes sociales", priority: "alta", dueDate: "2026-05-15", status: "pendiente", responsible: "Laura Gómez", notes: "Incluir benchmarks del sector SaaS" },
      { id: "a2", title: "Reunión de kickoff campaña Google Ads", priority: "alta", dueDate: "2026-05-12", status: "en_progreso", responsible: "Carlos Ruiz", notes: "Confirmar presupuesto con el cliente" },
      { id: "a3", title: "Revisión de creatividades para LinkedIn", priority: "media", dueDate: "2026-05-20", status: "pendiente", responsible: "María Torres" },
      { id: "a4", title: "Informe mensual de resultados", priority: "media", dueDate: "2026-05-30", status: "pendiente", responsible: "Laura Gómez" },
    ],
    resources: [
      { id: "r1", name: "Brief Campaña Q3 2026", type: "brief", url: "https://drive.google.com/brief-q3", description: "Brief completo para la campaña del tercer trimestre", addedDate: "2026-04-20" },
      { id: "r2", name: "Manual de Marca TechVision", type: "doc", url: "https://drive.google.com/brand-manual", description: "Guía de identidad visual actualizada", addedDate: "2026-03-15" },
      { id: "r3", name: "Landing Page Principal", type: "link", url: "https://techvision.com", addedDate: "2026-01-10" },
    ],
    team: [
      { id: "t1", name: "Laura Gómez", role: "Account Manager", email: "laura@agencia.com" },
      { id: "t2", name: "Carlos Ruiz", role: "Paid Media Specialist", email: "carlos@agencia.com" },
      { id: "t3", name: "María Torres", role: "Diseñadora Creativa", email: "maria@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Leads Generados", current: 340, target: 500, unit: "leads", deadline: "2026-06-30", notes: "Meta trimestral Q2" },
      { id: "o2", metric: "CTR Campañas", current: 3.2, target: 5.0, unit: "%", deadline: "2026-06-30" },
      { id: "o3", metric: "ROAS Google Ads", current: 4.1, target: 6.0, unit: "x", deadline: "2026-06-30" },
    ],
  },
  {
    id: "2",
    name: "Moda Nova",
    industry: "E-commerce / Moda",
    color: "#ec4899",
    contactName: "Valentina Cruz",
    contactEmail: "v.cruz@modanova.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Lanzamiento colección verano en Instagram", priority: "alta", dueDate: "2026-05-10", status: "en_progreso", responsible: "Diego Sánchez" },
      { id: "a2", title: "Configurar catálogo Meta Ads", priority: "alta", dueDate: "2026-05-14", status: "pendiente", responsible: "Carlos Ruiz" },
      { id: "a3", title: "Influencer briefing para TikTok", priority: "media", dueDate: "2026-05-22", status: "pendiente", responsible: "Diego Sánchez" },
    ],
    resources: [
      { id: "r1", name: "Catálogo Colección Verano 2026", type: "doc", url: "https://drive.google.com/catalogo-verano", description: "Fichas de producto y precios", addedDate: "2026-04-30" },
      { id: "r2", name: "Assets Creativos Temporada", type: "brief", url: "https://drive.google.com/assets-verano", description: "Fotografías y videos para campañas", addedDate: "2026-04-28" },
    ],
    team: [
      { id: "t1", name: "Laura Gómez", role: "Account Manager", email: "laura@agencia.com" },
      { id: "t2", name: "Diego Sánchez", role: "Social Media Manager", email: "diego@agencia.com" },
      { id: "t3", name: "Carlos Ruiz", role: "Paid Media Specialist", email: "carlos@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Ventas Online", current: 85000, target: 150000, unit: "€", deadline: "2026-08-31" },
      { id: "o2", metric: "Seguidores Instagram", current: 28000, target: 50000, unit: "followers", deadline: "2026-08-31" },
    ],
  },
  {
    id: "3",
    name: "FinPro Consultores",
    industry: "Servicios Financieros",
    color: "#10b981",
    contactName: "Roberto Herrera",
    contactEmail: "r.herrera@finpro.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Auditoría SEO sitio web", priority: "alta", dueDate: "2026-05-18", status: "pendiente", responsible: "Ana Jiménez" },
      { id: "a2", title: "Crear contenido para blog financiero", priority: "media", dueDate: "2026-05-25", status: "pendiente", responsible: "Pedro Álvarez" },
    ],
    resources: [
      { id: "r1", name: "Análisis Competencia 2026", type: "doc", url: "https://drive.google.com/analisis-finpro", addedDate: "2026-04-15" },
    ],
    team: [
      { id: "t1", name: "Ana Jiménez", role: "SEO Specialist", email: "ana@agencia.com" },
      { id: "t2", name: "Pedro Álvarez", role: "Content Writer", email: "pedro@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Posición Media SEO", current: 18, target: 5, unit: "posición", deadline: "2026-09-30" },
      { id: "o2", metric: "Tráfico Orgánico Mensual", current: 3200, target: 10000, unit: "visitas", deadline: "2026-09-30" },
    ],
  },
  {
    id: "4",
    name: "Sabores del Mundo",
    industry: "Restauración / Food",
    color: "#f59e0b",
    contactName: "Carmen López",
    contactEmail: "c.lopez@saboresdelmundo.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Gestión reseñas Google My Business", priority: "alta", dueDate: "2026-05-11", status: "completada", responsible: "Diego Sánchez" },
      { id: "a2", title: "Calendario contenido redes mayo", priority: "media", dueDate: "2026-05-13", status: "en_progreso", responsible: "Diego Sánchez" },
      { id: "a3", title: "Campaña lanzamiento nuevo menú", priority: "alta", dueDate: "2026-05-28", status: "pendiente", responsible: "María Torres" },
    ],
    resources: [
      { id: "r1", name: "Guía de Tono y Voz", type: "brief", url: "https://drive.google.com/tono-sabores", addedDate: "2026-02-20" },
      { id: "r2", name: "Menú Actualizado Mayo", type: "doc", url: "https://drive.google.com/menu-mayo", addedDate: "2026-04-29" },
    ],
    team: [
      { id: "t1", name: "Diego Sánchez", role: "Social Media Manager", email: "diego@agencia.com" },
      { id: "t2", name: "María Torres", role: "Diseñadora Creativa", email: "maria@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Reservas Online", current: 120, target: 300, unit: "reservas/mes", deadline: "2026-07-31" },
      { id: "o2", metric: "Valoración Google", current: 4.1, target: 4.7, unit: "estrellas", deadline: "2026-07-31" },
    ],
  },
  {
    id: "5",
    name: "AutoMax Concesionario",
    industry: "Automoción",
    color: "#6366f1",
    contactName: "Miguel Fernández",
    contactEmail: "m.fernandez@automax.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Campaña Meta Ads modelos 2026", priority: "alta", dueDate: "2026-05-16", status: "pendiente", responsible: "Carlos Ruiz" },
      { id: "a2", title: "Producción vídeos showroom", priority: "media", dueDate: "2026-05-30", status: "pendiente", responsible: "María Torres" },
    ],
    resources: [
      { id: "r1", name: "Stock Vehículos Disponibles", type: "link", url: "https://automax.com/stock", addedDate: "2026-04-01" },
    ],
    team: [
      { id: "t1", name: "Carlos Ruiz", role: "Paid Media Specialist", email: "carlos@agencia.com" },
      { id: "t2", name: "María Torres", role: "Diseñadora Creativa", email: "maria@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Test Drives Agendados", current: 45, target: 100, unit: "por mes", deadline: "2026-07-31" },
      { id: "o2", metric: "Leads Cualificados", current: 78, target: 200, unit: "leads/mes", deadline: "2026-07-31" },
    ],
  },
  {
    id: "6",
    name: "EduLearn Platform",
    industry: "EdTech / Educación",
    color: "#06b6d4",
    contactName: "Sofía Martínez",
    contactEmail: "s.martinez@edulearn.io",
    status: "activo",
    actions: [
      { id: "a1", title: "Lanzamiento campaña back to school", priority: "alta", dueDate: "2026-05-19", status: "pendiente", responsible: "Laura Gómez" },
      { id: "a2", title: "Email marketing automatización", priority: "media", dueDate: "2026-05-26", status: "en_progreso", responsible: "Ana Jiménez" },
    ],
    resources: [
      { id: "r1", name: "Deck Producto EduLearn", type: "doc", url: "https://drive.google.com/deck-edulearn", addedDate: "2026-03-10" },
      { id: "r2", name: "Base de Datos Leads", type: "brief", url: "https://drive.google.com/leads-edulearn", addedDate: "2026-04-22" },
    ],
    team: [
      { id: "t1", name: "Laura Gómez", role: "Account Manager", email: "laura@agencia.com" },
      { id: "t2", name: "Ana Jiménez", role: "Email Marketing Specialist", email: "ana@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Alumnos Nuevos", current: 1200, target: 3000, unit: "alumnos", deadline: "2026-09-01" },
      { id: "o2", metric: "Tasa de Conversión Trial", current: 8.5, target: 20, unit: "%", deadline: "2026-09-01" },
    ],
  },
  {
    id: "7",
    name: "GreenBuild Arquitectura",
    industry: "Arquitectura / Construcción",
    color: "#84cc16",
    contactName: "Javier Ortega",
    contactEmail: "j.ortega@greenbuild.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Rebranding web corporativa", priority: "alta", dueDate: "2026-05-21", status: "en_progreso", responsible: "María Torres" },
      { id: "a2", title: "Case studies proyectos destacados", priority: "media", dueDate: "2026-06-05", status: "pendiente", responsible: "Pedro Álvarez" },
    ],
    resources: [
      { id: "r1", name: "Portfolio Proyectos 2025", type: "doc", url: "https://drive.google.com/portfolio-gb", addedDate: "2026-04-01" },
    ],
    team: [
      { id: "t1", name: "María Torres", role: "Diseñadora Creativa", email: "maria@agencia.com" },
      { id: "t2", name: "Pedro Álvarez", role: "Content Writer", email: "pedro@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Consultas Web", current: 25, target: 80, unit: "consultas/mes", deadline: "2026-10-31" },
    ],
  },
  {
    id: "8",
    name: "HealthFirst Clínica",
    industry: "Salud / Clínica",
    color: "#f43f5e",
    contactName: "Dra. Elena Vega",
    contactEmail: "e.vega@healthfirst.com",
    status: "activo",
    actions: [
      { id: "a1", title: "Google Ads campañas tratamientos", priority: "alta", dueDate: "2026-05-13", status: "completada", responsible: "Carlos Ruiz" },
      { id: "a2", title: "Gestión RRSS con contenido médico", priority: "media", dueDate: "2026-05-17", status: "en_progreso", responsible: "Diego Sánchez" },
    ],
    resources: [
      { id: "r1", name: "Protocolos Contenido Salud", type: "doc", url: "https://drive.google.com/protocolos-hf", addedDate: "2026-02-14" },
    ],
    team: [
      { id: "t1", name: "Carlos Ruiz", role: "Paid Media Specialist", email: "carlos@agencia.com" },
      { id: "t2", name: "Diego Sánchez", role: "Social Media Manager", email: "diego@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Citas Agendadas Online", current: 180, target: 400, unit: "citas/mes", deadline: "2026-08-31" },
      { id: "o2", metric: "Coste por Cita (CPA)", current: 28, target: 15, unit: "€", deadline: "2026-08-31" },
    ],
  },
  {
    id: "9",
    name: "LogiTrack Express",
    industry: "Logística / Transporte",
    color: "#f97316",
    contactName: "Tomás Guerrero",
    contactEmail: "t.guerrero@logitrack.com",
    status: "pausado",
    actions: [
      { id: "a1", title: "Reactivar campañas B2B LinkedIn", priority: "alta", dueDate: "2026-05-29", status: "pendiente", responsible: "Laura Gómez" },
    ],
    resources: [
      { id: "r1", name: "Propuesta Reactivación 2026", type: "brief", url: "https://drive.google.com/reactivacion-lt", addedDate: "2026-04-25" },
    ],
    team: [
      { id: "t1", name: "Laura Gómez", role: "Account Manager", email: "laura@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Contratos B2B Nuevos", current: 3, target: 15, unit: "contratos/trimestre", deadline: "2026-09-30" },
    ],
  },
  {
    id: "10",
    name: "StartUp Nexus",
    industry: "Venture / Startups",
    color: "#a855f7",
    contactName: "Isabela Ramos",
    contactEmail: "i.ramos@startupnexus.io",
    status: "prospecto",
    actions: [
      { id: "a1", title: "Enviar presentación de servicios", priority: "alta", dueDate: "2026-05-12", status: "pendiente", responsible: "Laura Gómez" },
      { id: "a2", title: "Call de descubrimiento de necesidades", priority: "alta", dueDate: "2026-05-15", status: "pendiente", responsible: "Laura Gómez" },
    ],
    resources: [
      { id: "r1", name: "Deck Agencia 2026", type: "doc", url: "https://drive.google.com/deck-agencia", addedDate: "2026-05-01" },
    ],
    team: [
      { id: "t1", name: "Laura Gómez", role: "Account Manager", email: "laura@agencia.com" },
    ],
    objectives: [
      { id: "o1", metric: "Conversión a Cliente", current: 0, target: 1, unit: "contrato", deadline: "2026-05-31" },
    ],
  },
];
