# SexShop del Perú - Storefront (Next.js 14)

Tienda mobile-first, rápida y escalable con Next.js 14 (App Router), TypeScript y Tailwind CSS.
SEO controlado (por contenido sensible), medición con GA4/Google Ads, mega-menú tipo “HER/HIM/COUPLES” y colecciones dinámicas.
Despliegue automático a VPS Ubuntu (Node 20 + PM2 + Nginx) vía GitHub Actions.

---

## Tabla de contenido
- Objetivos del proyecto
- Stack técnico
- Estructura del repo
- Datos del catálogo
- Colecciones y mega-menú
- Filtros (AND/OR)
- Guía de estilos
- Variables de entorno
- Scripts npm
- Ejecución local
- CI/CD y despliegue
- Checklist de calidad (DoD)
- Solución de problemas
- Roadmap
- Convenciones de contribución
- Licencia

---

## Objetivos del proyecto
- Core Web Vitals verdes y accesibilidad AA.
- Catálogo completo: categorías, subcategorías, búsqueda, fichas con alto CTR.
- Colecciones didácticas (HER/HIM/COUPLES) y de marketing (Ofertas, Novedades).
- Backoffice simple para CRUD de productos, imágenes, banners, landings y blog.
- Medición GA4/Ads con eventos de embudo (page_view, select_item, add_to_cart, etc.).
- Chat de IA: stub ahora; integración futura sin romper arquitectura.

---

## Stack técnico
- Frontend: Next.js 14 (App Router), React Server Components, TypeScript, Tailwind CSS, next/image.
- Formularios (panel): React Hook Form + Zod.
- Servidor: Node 20, runtime "nodejs" cuando haya APIs de Node (fs/path).
- Infra: VPS Ubuntu + PM2 + Nginx, GitHub Actions (deploy por SSH).
- Datos (fase actual): JSON en /data y assets en /public. Futuro: PostgreSQL + Prisma.
- Utilidades: sanitize-html para limpiar HTML residual en descripciones.

---

## Estructura del repo
app/
  page.tsx                      -> Home
  producto/[slug]/              -> Ficha de producto (SSG recomendado)
  categoria/[slug]/             -> Listado por categoría + filtros
  coleccion/[slug]/             -> Listados por colecciones dinámicas (HER/HIM/COUPLES)
  ads/variant-a|b/              -> Landings A/B
components/
  nav/DesktopMenu.tsx           -> Mega-menu desktop (sheet a pantalla completa)
  nav/MobileMenu.tsx            -> Mega-menu mobile (drawer)
  nav/NavMegaMenu.tsx          -> Dispara Desktop/Mobile y eventos de overlay
  nav/menu-utils.ts            -> Helpers (focus trap, bloqueo de scroll, columnas)
  ProductCard.tsx               -> Tarjeta de producto
  ...
data/
  products.json                 -> Catálogo (fase JSON)
  categories.json               -> Árbol de categorías/subcategorías
  collections.json              -> Reglas de colecciones (HER/HIM/COUPLES, etc.)
  mega-menu.config.ts           -> Jerarquía oficial de categorías/subcategorías para el mega-menú
lib/
  products.ts                   -> Carga, filtrado, helpers
  tagging.ts                    -> Auto-etiquetado (tags) por reglas
  analytics.ts                  -> GA4 helpers
public/
  products/<slug>/1.webp        -> Assets por producto (solo .webp/.avif)

---

## Datos del catálogo
- products.json (fase actual): id, slug, name, category, subCategory?, regularPrice, salePrice?, nsfw, descriptionHtml, imageSet, tags?.
- categories.json: categorías oficiales del dueño y subcategorías.
- Imágenes: public/products/<slug>/1.webp, 2.webp, ...
- NSFW: si nsfw=true, se envía cabecera X-Robots-Tag: noimageindex en la respuesta de las páginas afectadas.

SSG recomendado para producto/[slug] con generateStaticParams().

---

## Colecciones y mega-menú (actualizado)
- Colecciones (marketing, no son categorías): definidas en data/collections.json.
  Ejemplo:
  [
    { "slug": "para-ella",    "label": "HER",     "tags": ["persona:her"] },
    { "slug": "para-el",      "label": "HIM",     "tags": ["persona:him","uso:pene"] },
    { "slug": "para-parejas", "label": "COUPLES", "tags": ["persona:couples"] }
  ]
- Mega-menú responsive: NavMegaMenu + DesktopMenu/MobileMenu consumen data/mega-menu.config.ts, que ahora es la fuente de verdad validada por negocio.
  1) chips de persona HER/HIM/COUPLES con acentos personalizados.
  2) hoja desktop con columnas animadas y drawer mobile; ambos respetan la jerarquía aprobada.

- Tags inteligentes (auto-tagging): lib/tagging.ts añade tags por categoría, subcategoría y keywords. Convención:
  persona:her|him|couples
  uso:anal|vaginal|clitoral|pene|fantasia|bondage|masaje|lubricacion
  feature:rabbit|clasico|realista|doble|strapon|suction|electro|remote|wand|thrust|egg
  material:silicona|gelatinoso|cyberskin|vidrio|metal|tpe

---

## Filtros (AND/OR)
- Categoría/subcategoría: AND (restringe universo).
- Facetas por tags: AND entre facetas; OR dentro de la misma faceta.
  Ej.: persona=her OR couples, AND uso=anal, AND material=gelatinoso.

Implementación en lib/products.ts -> filterProducts().

---

## Guía de estilos
- Fondo de contenido: blanco; nav y overlays usan negro translúcido con blur.
- Tipografía: Jost 400/500/600/700 (variable --font-sans); encabezados pueden usar Cormorant para acentos.
- Paleta oficial: negro (#000), blanco y acentos persona (#ff2193, #1151bb, #0098d5).
- Tarjeta de producto: imagen alta (aspect 3/4), solo título + precio; botón "vista rápida" como icono de ojo en esquina superior derecha.
- Grid de listados: 2 columnas en móvil; 5–6 en escritorio (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6).
- Accesibilidad: foco visible, tamaño táctil >=44px, aria en mega-menú, Esc cierra.

---

## Variables de entorno
Cree .env.local (no se commitea):

NEXT_PUBLIC_SITE_URL=https://sexshopcereza.com
NEXT_PUBLIC_GA4_ID=G-XXXXXXX
NEXT_PUBLIC_ADS_CONVERSION_ID=AW-XXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=+51XXXXXXXXX

Mismos valores en el VPS. No subir secretos al repo.

---

## Scripts npm
npm ci
npm run dev
npm run build
npm start
npm run lint
npm run typecheck

---

## Ejecución local
1) Node 20 (nvm use 20 opcional)
2) Crear .env.local
3) npm ci
4) npm run dev
Abrir http://localhost:3000

---

## CI/CD y despliegue
- GitHub Actions despliega por SSH y ejecuta /home/deploy/bin/deploy_sexshop69.sh:
  git fetch && git reset --hard origin/main
  npm ci && npm run build
  pm2 restart sexshop69

- Nginx como reverse proxy; Next sirve /_next/* y /public/*.

Comprobaciones rápidas en servidor:
curl -I https://sexshopcereza.com
curl -I https://sexshopcereza.com/producto/<slug>
pm2 logs sexshop69 --lines 200

---

## Checklist de calidad (Definition of Done)
- Build OK en local y en Actions.
- Home, Categoría, Producto y landings A/B cargan < 2 s (4G simulado).
- Fichas renderizan para varios slugs sin excepciones.
- GA4 emite page_view, select_item, add_to_cart y eventos del chat (stub).
- NSFW: X-Robots-Tag noimageindex aplicado donde corresponda.
- PR pequeño con impacto SEO/tracking y pasos de prueba.

---

## Solución de problemas
1) “Application error… server-side exception / Digest …”
   - Causa frecuente: usar APIs de Node en Edge (fs/path).
   - Solución: export const runtime = 'nodejs' o eliminar fs en runtime y usar datos.

2) TypeScript: falta @types/sanitize-html
   - npm i -D @types/sanitize-html

3) Tipos de categorías
   - Asegure que CategoryDefinition permita image: string | null, o que el JSON use string.

4) No aparecen productos
   - Verificar data/products.json poblado y slugs de categoría/subcategoría correctos.
   - Confirmar public/products/<slug>/1.webp existe.

---

## Roadmap
- Hito A (actual): catálogo sólido + colecciones + mega-menú + A/B + tracking.
- Hito B: backoffice (Auth, CRUD productos/categorías, banners, blog).
- Hito C: checkout MVP (pasarela, webhooks, mails, estados).
- Hito D: migración a PostgreSQL + Prisma e import masivo (WordPress XML).
- Hito E: chat IA v1 (RAG + acciones carrito + escalado WhatsApp).

---

## Convenciones de contribución
- Commits: feat:, fix:, chore:, refactor:, docs:
- PRs: pequeños, con riesgos, impacto SEO/tracking y pasos de prueba.
- Ramas: feature/<nombre>, fix/<nombre>. Merge a main vía PR.

---

## Licencia
Código privado. Derechos reservados al propietario.
