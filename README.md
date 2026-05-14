# Distribuidora

Full-stack web app for a food distributor — replaces manual/informal process of sharing offers.

## Stack
- **Next.js 16** (App Router) + Tailwind CSS v4
- **NextAuth.js v4** credentials + JWT sessions
- **Prisma 7** + `@prisma/adapter-pg` + PostgreSQL via Supabase
- **Vercel** deployment

## Setup

```bash
npm install
cp .env.example .env.local  # fill in DATABASE_URL and NEXTAUTH_SECRET
npm run db:push             # push schema to Supabase
npm run db:seed             # seed admin + demo client + 15 products
npm run dev
```

## Credentials (after seed)

| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@distribuidora.com  | admin123   |
| Client | cliente@test.com         | cliente123 |

## Routes

| Path                    | Role   | Description                    |
|-------------------------|--------|--------------------------------|
| `/login`                | public | Login page                     |
| `/admin`                | ADMIN  | Dashboard with stats           |
| `/admin/productos`      | ADMIN  | Product CRUD                   |
| `/admin/usuarios`       | ADMIN  | Create/disable client accounts |
| `/admin/pedidos`        | ADMIN  | View & advance order status    |
| `/catalogo`             | CLIENT | Browse products, filter        |
| `/catalogo/carrito`     | CLIENT | Cart + submit order            |
| `/pedidos`              | CLIENT | Own order history              |

## Deployment

Set these environment variables in Vercel:
- `DATABASE_URL` — Supabase connection string
- `NEXTAUTH_SECRET` — random secret (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — your Vercel URL
