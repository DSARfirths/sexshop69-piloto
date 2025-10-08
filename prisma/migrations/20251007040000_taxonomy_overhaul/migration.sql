-- DropIndex
DROP INDEX IF EXISTS "public"."Subcategory_slug_key";

-- AlterTable: Category
ALTER TABLE "Category"
  ADD COLUMN "image" TEXT,
  ADD COLUMN "isSensitive" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "subtitle" TEXT,
  ADD COLUMN "tagline" TEXT;

-- AlterTable: MenuSection
ALTER TABLE "MenuSection"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "MenuSection"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Product
ALTER TABLE "Product"
  ADD COLUMN "embeddingText" TEXT,
  ALTER COLUMN "rating" DROP NOT NULL,
  ALTER COLUMN "reviewCount" DROP NOT NULL;

-- AlterTable: ProductImage
ALTER TABLE "ProductImage"
  DROP COLUMN IF EXISTS "order",
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: Subcategory (safe sequence)
ALTER TABLE "Subcategory"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "description" TEXT;

ALTER TABLE "Subcategory"
  ADD COLUMN "label" TEXT;

UPDATE "Subcategory"
SET "label" = COALESCE("name", INITCAP(REPLACE("slug", '-', ' ')))
WHERE "label" IS NULL;

ALTER TABLE "Subcategory"
  ALTER COLUMN "label" SET NOT NULL;

ALTER TABLE "Subcategory"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Subcategory"
  DROP COLUMN IF EXISTS "menuLabel";

ALTER TABLE "Subcategory"
  DROP COLUMN IF EXISTS "name";

-- CreateTable: SubcategoryAlias
CREATE TABLE "SubcategoryAlias" (
    "id" SERIAL NOT NULL,
    "aliasSlug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "subcategoryId" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubcategoryAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Collection
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CollectionTarget
CREATE TABLE "CollectionTarget" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "subcategoryId" INTEGER,
    "includeAll" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectionTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubcategoryAlias_aliasSlug_key" ON "SubcategoryAlias"("aliasSlug");

CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

CREATE UNIQUE INDEX "CollectionTarget_collectionId_categoryId_subcategoryId_key"
  ON "CollectionTarget"("collectionId", "categoryId", "subcategoryId");

CREATE UNIQUE INDEX "MenuSection_categoryId_name_key" ON "MenuSection"("categoryId", "name");

CREATE UNIQUE INDEX "ProductTag_productId_type_value_key" ON "ProductTag"("productId", "type", "value");

CREATE UNIQUE INDEX "Subcategory_categoryId_slug_key" ON "Subcategory"("categoryId", "slug");

-- AddForeignKey
ALTER TABLE "SubcategoryAlias"
  ADD CONSTRAINT "SubcategoryAlias_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SubcategoryAlias"
  ADD CONSTRAINT "SubcategoryAlias_subcategoryId_fkey"
  FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollectionTarget"
  ADD CONSTRAINT "CollectionTarget_collectionId_fkey"
  FOREIGN KEY ("collectionId") REFERENCES "Collection"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CollectionTarget"
  ADD CONSTRAINT "CollectionTarget_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollectionTarget"
  ADD CONSTRAINT "CollectionTarget_subcategoryId_fkey"
  FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
