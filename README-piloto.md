# Piloto SexShop69 — Cómo correr

## 1) Instalar
npm i
npm run dev

## 2) Variables (cuando integremos pasarela)
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# CULQI / NIUBIZ sandbox: agregar luego

## 3) ¿Dónde editar?
- Catálogo demo: app/categoria/[slug]/page.tsx y app/producto/[slug]/page.tsx
- Burbuja IA (reglas): components/ChatBubble.tsx (getSuggestions)
- Landings Ads: app/ads/variant-a y app/ads/variant-b

## 4) Producción (recomendado DO + Cloudflare)
- Build: npm run build && npm run start (pm2)
- Nginx: proxy pass ➜ Node 3000; TLS; cache estáticos; limitar /api
- CDN: activar en /_next/static, /sfw-assets y /nsfw-assets con headers ya configurados
