-- ===== BASELINE FIX =====
-- Crea sólo lo mínimo necesario para que 20251007_taxonomy_overhaul pueda ALTER sin fallar.
-- Seguro para re-ejecución gracias a IF NOT EXISTS.

-- CATEGORY
CREATE TABLE IF NOT EXISTS "Category" (
  "id" SERIAL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

-- SUBCATEGORY (antes del overhaul tenía name/menuLabel y unique en slug)
CREATE TABLE IF NOT EXISTS "Subcategory" (
  "id" SERIAL PRIMARY KEY,
  "categoryId" INTEGER NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "menuLabel" TEXT,
  CONSTRAINT "Subcategory_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Subcategory_slug_key" ON "Subcategory"("slug");

-- PRODUCT (el overhaul sólo toca rating/reviewCount + agrega embeddingText)
-- Creamos columnas mínimas incluidas rating y reviewCount como NOT NULL (luego el overhaul les quita el NOT NULL)
CREATE TABLE IF NOT EXISTS "Product" (
  "id" SERIAL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0
);

-- PRODUCT IMAGE (antes tenía columna "order" que el overhaul reemplaza por "sortOrder")
CREATE TABLE IF NOT EXISTS "ProductImage" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductImage_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- PRODUCT TAG (el overhaul luego crea un índice único compuesto)
CREATE TABLE IF NOT EXISTS "ProductTag" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "ProductTag_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- MENU SECTION (el overhaul luego añade createdAt/updatedAt y un índice único)
CREATE TABLE IF NOT EXISTS "MenuSection" (
  "id" SERIAL PRIMARY KEY,
  "categoryId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "MenuSection_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
-- ===== FIN BASELINE FIX =====
