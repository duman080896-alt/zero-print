# ZERO PRINT — Corporate Merch & Printing B2B Website

## Overview
A modern, conversion-focused B2B website for ZERO PRINT (zero-promo.kz), a Kazakh company offering corporate merchandise, tailoring, textile, and professional printing/polygraphy services. Includes a live product catalog synced from Oasis Catalog API, client portal with registration/login/dashboard, and manager portal with KP creation.

## Tech Stack
- **Frontend**: React + TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js (TypeScript), csv-parse, node-cron, bcryptjs, jsonwebtoken, nodemailer
- **Database**: PostgreSQL with Drizzle ORM

## Contact Info
- **WhatsApp**: +7 771 624 64 61 (wa.me/77716246461)
- **Phone**: +7 700 158 40 39 (tel:+77001584039)
- **Address**: г. Алматы, ул. Радостовца 152/6, офис 104
- **Hours**: Пн-Пт: 9:00 — 18:00
- **Email**: zeroprint.kz@gmail.com
- **Instagram**: https://instagram.com/zeroprint.kz

## Color Scheme
- **Primary**: Deep Navy Blue (222 47% 11%)
- **Accent**: Soft Orange (24 94% 67%) — for CTAs
- **WhatsApp Green**: #25D366
- **Phone/CTA Orange**: #E8500A
- **Background**: White / Light Gray
- **Logo**: "ZERO" in blue, "PRINT" in white on blue background — do NOT change

## Project Structure
```
client/src/
  App.tsx              — Main router (includes FloatingButtons globally)
  pages/
    Home.tsx           — Landing page
    Catalog.tsx        — Product catalog (Oasis-style layout)
    ProductPage.tsx    — Product detail page
    Landing.tsx        — Dynamic B2B landing (/landing?utm_term=vyshivka|poshiv|suvenir|poligrafiya)
    Poshiv.tsx         — Tailoring services page (/poshiv)
    Poligrafiya.tsx    — Printing/polygraphy B2B landing (/poligrafiya) — full SEO, Schema.org
    Portfolio.tsx      — Portfolio gallery
    About.tsx          — About company
    Contact.tsx        — Contacts page (/kontakty) — map, form, directions
    Cart.tsx           — Shopping cart with order form
    uslugi/
      ServiceLanding.tsx   — Reusable service page template (8 blocks)
      Vyshivka.tsx         — /uslugi/vyshivka — Embroidery services
      Pechat.tsx           — /uslugi/pechat — Printing & application
      PoshivUslugi.tsx     — /uslugi/poshiv — Tailoring services
      Brendirovanie.tsx    — /uslugi/brendirovanie — Souvenir branding
    account/
      Login.tsx            — /account/login — Client login form
      Register.tsx         — /account/register — Client registration form
      Dashboard.tsx        — /account — Client dashboard (orders, wishlist, KPs, profile)
    manager/
      Login.tsx            — /manager/login — Manager login form
      Dashboard.tsx        — /manager — Manager dashboard (KPs, clients, orders, subscribers, settings)
      KpCreate.tsx         — /manager/kp/create — KP creation with product search
  components/
    layout/Navbar.tsx  — Header: 2-row layout, Row 1: logo + search + account + cart + WhatsApp, Row 2: mega-menu nav
    layout/Footer.tsx  — Footer with full contact info
    shared/FloatingButtons.tsx — Fixed bottom-right WhatsApp + Phone buttons
    shared/LeadForm.tsx
    shared/SmartLeadForm.tsx
    shared/TrustedLogos.tsx
    shared/ServiceCard.tsx
    shared/ProjectCard.tsx
  hooks/
    useCart.ts          — Cart state (localStorage "zeroprint_cart")
    useClientAuth.ts    — Client auth state (client_token + client_data in localStorage)
    useManagerAuth.ts   — Manager auth state (manager_token + manager_data in localStorage)
    useSEO.ts           — Dynamic SEO meta tags hook
  lib/
    colors.ts          — 300+ Russian color→hex mappings

server/
  index.ts             — Express server entry
  routes.ts            — API routes + auth + sitemap.xml + robots.txt
  db.ts                — Drizzle PostgreSQL connection
  productSync.ts       — Oasis CSV API sync (daily cron at 3AM)

shared/
  schema.ts            — Drizzle schema (clients, orders, wishlist, managers, proposals, subscribers)

data/products.json     — Cached products (auto-generated)
```

## Database Tables
- **clients**: id, name, email, phone, company, password_hash, is_verified, discount, manager_id
- **orders**: id, client_id, client_name, client_phone, company, items (jsonb), total_price, branding, comment, status, manager_id
- **wishlist**: id, client_id, product_id
- **managers**: id, name, email, password_hash, phone
- **proposals**: id, manager_id, manager_name, manager_phone, client_id, title, client_name, client_contact, client_logo_url, branding, comment, items (jsonb), valid_days, views
- **subscribers**: id, email, name, is_active

## Auth System
- JWT-based auth with client_token/manager_token in localStorage
- Client: register, login, profile update, wishlist, orders, proposals
- Manager: login, manage KPs/clients/orders/subscribers
- First manager: duman080896@gmail.com (created via POST /api/manager/init)
- JWT_SECRET env var

## Key Features
- **Product Catalog**: ~5,700 grouped products from Oasis API
- **Client Portal**: Registration, login, dashboard with orders/wishlist/KPs/profile tabs
- **Manager Portal**: Dashboard with KPs/clients/orders/subscribers/settings tabs, KP creation with product search, KP share links + views tracking + PDF-quality HTML output
- **4 Service Landing Pages** (/uslugi/*): Each has 8 blocks
- **Navbar Mega-Menu**: Каталог (3-col), Пошив (7 items), Услуги (4 items), + account button
- **Cart System**: localStorage-based cart with useCart hook
- **SEO**: Dynamic meta tags, Schema.org JSON-LD, sitemap.xml, robots.txt
- Tiered pricing markup (MARKUP_RULES in server/productSync.ts)

## URL Structure
- / — Home
- /landing?utm_term=vyshivka|poshiv|suvenir|poligrafiya — Dynamic B2B landings
- /catalog — All products
- /catalog?category=futbolki — Category filter
- /catalog/product/:id — Product detail
- /poshiv — Main tailoring page
- /poligrafiya — Main polygraphy B2B landing
- /uslugi/vyshivka — Embroidery service page
- /uslugi/pechat — Printing service page
- /uslugi/poshiv — Tailoring service page
- /uslugi/brendirovanie — Branding service page
- /portfolio — Portfolio
- /about — About
- /kontakty — Contacts with map
- /cart — Shopping cart with order form
- /account/login — Client login
- /account/register — Client registration
- /account — Client dashboard
- /manager/login — Manager login
- /manager — Manager dashboard
- /manager/kp/create — Create KP
- /kp/:id — Public KP view page (shareable link)
- /api/kp/:id — Public KP API (returns JSON, increments views)
- /api/kp/:id/html — Public KP printable HTML (PDF-quality)
- /sitemap.xml — Dynamic sitemap
- /robots.txt — Robots file

## Important Notes
- All UI text is in Russian
- Logo: "ZERO" blue + "PRINT" white on blue — do NOT change
- Product data refreshes daily at 3:00 AM via cron
- OASIS_API_KEY env var for Oasis Catalog API
- JWT_SECRET env var for auth tokens
- Base URL: https://zero-promo--duman080896.replit.app
