# Database Schema Documentation

## Overview

This document defines the complete database schema for the Inventory Management System, including tables, relationships, constraints, and indexing strategies.

**Database:** PostgreSQL 16.x  
**ORM:** Prisma 5.x  
**Migration Strategy:** Prisma Migrate

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│    Product      │
├─────────────────┤
│ id (PK)         │
│ code (UNIQUE)   │
│ name            │
│ value           │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ 1
         │
         │ N
         │
┌────────┴──────────────┐
│  ProductMaterial      │
├───────────────────────┤
│ id (PK)               │
│ productId (FK)        │
│ rawMaterialId (FK)    │
│ quantityNeeded        │
│ createdAt             │
│ updatedAt             │
└────────┬──────────────┘
         │
         │ N
         │
         │ 1
         │
┌────────┴────────┐
│  RawMaterial    │
├─────────────────┤
│ id (PK)         │
│ code (UNIQUE)   │
│ name            │
│ quantityInStock │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

---

## Prisma Schema Definition

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =====================
// Product Entity
// =====================
model Product {
  id        String   @id @default(uuid())
  code      String   @unique @db.VarChar(50)
  name      String   @db.VarChar(255)
  value     Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  materials ProductMaterial[]
  
  @@map("products")
  @@index([code])
}

// =====================
// Raw Material Entity
// =====================
model RawMaterial {
  id              String   @id @default(uuid())
  code            String   @unique @db.VarChar(50)
  name            String   @db.VarChar(255)
  quantityInStock Int      @default(0) @map("quantity_in_stock")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  products ProductMaterial[]
  
  @@map("raw_materials")
  @@index([code])
}

// =====================
// Product-Material Association Entity (Join Table)
// =====================
model ProductMaterial {
  id             String   @id @default(uuid())
  productId      String   @map("product_id")
  rawMaterialId  String   @map("raw_material_id")
  quantityNeeded Int      @map("quantity_needed")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  
  product     Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  rawMaterial RawMaterial @relation(fields: [rawMaterialId], references: [id], onDelete: Cascade)
  
  @@unique([productId, rawMaterialId])
  @@map("product_materials")
  @@index([productId])
  @@index([rawMaterialId])
}
```

---

## Table Specifications

### 1. products

**Purpose:** Stores information about manufactured products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Product code (business key) |
| name | VARCHAR(255) | NOT NULL | Product name |
| value | DECIMAL(10,2) | NOT NULL | Unit value/price |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `code`

**Business Rules:**
- `code` must be unique across all products
- `value` must be positive (enforced at application level)
- `name` cannot be empty

---

### 2. raw_materials

**Purpose:** Stores information about raw materials (inputs for production).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Material code (business key) |
| name | VARCHAR(255) | NOT NULL | Material name |
| quantity_in_stock | INTEGER | NOT NULL, DEFAULT 0 | Current stock level |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `code`

**Business Rules:**
- `code` must be unique across all materials
- `quantity_in_stock` must be non-negative (>= 0)
- Stock updates should be logged (future enhancement)

---

### 3. product_materials

**Purpose:** Many-to-many relationship between products and raw materials, defining Bill of Materials (BOM).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | FOREIGN KEY, NOT NULL | Reference to products table |
| raw_material_id | UUID | FOREIGN KEY, NOT NULL | Reference to raw_materials table |
| quantity_needed | INTEGER | NOT NULL | Quantity of material needed per product unit |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `(product_id, raw_material_id)` - prevents duplicate associations
- INDEX on `product_id` - optimize joins when querying by product
- INDEX on `raw_material_id` - optimize joins when querying by material

**Foreign Keys:**
- `product_id` REFERENCES `products(id)` ON DELETE CASCADE
- `raw_material_id` REFERENCES `raw_materials(id)` ON DELETE CASCADE

**Business Rules:**
- A product-material combination can only exist once
- `quantity_needed` must be positive (> 0)
- Deleting a product removes all its material associations
- Deleting a material removes all product associations using it

---

## Relationships

### Product → ProductMaterial (One-to-Many)
- One product can have multiple materials
- Cascade delete: removing a product deletes all its material associations

### RawMaterial → ProductMaterial (One-to-Many)
- One material can be used in multiple products
- Cascade delete: removing a material deletes all product associations

### Product ↔ RawMaterial (Many-to-Many)
- Implemented through `product_materials` join table
- Allows flexible BOM definitions

---

## Data Types Rationale

### UUID for Primary Keys
**Why:** 
- Globally unique identifiers
- No collision risk in distributed systems
- Better for microservices architecture
- Harder to enumerate/scrape

**Alternative:** Auto-incrementing integers (simpler but less scalable)

### DECIMAL(10,2) for Money
**Why:**
- Precise decimal arithmetic (no floating-point errors)
- 10 digits total, 2 after decimal point
- Supports values up to 99,999,999.99

**Example:** $1,234.56 → 1234.56

### INTEGER for Quantities
**Why:**
- Stock and quantity needed are whole numbers
- No fractional units in this domain
- Efficient storage and computation

### VARCHAR with Length Limits
**Why:**
- Prevents excessive data entry
- Database optimization
- Validation at DB level

---

## Indexing Strategy

### Purpose of Each Index

1. **Primary Key Indexes (id)**
   - Automatic in PostgreSQL
   - Clustered index for fast lookups
   - Used in foreign key relationships

2. **Unique Indexes (code fields)**
   - Enforce business uniqueness
   - Fast lookups by business key
   - Used in search/filter operations

3. **Foreign Key Indexes**
   - `product_materials.product_id`
   - `product_materials.raw_material_id`
   - Optimize JOIN operations
   - Speed up cascade delete operations

4. **Composite Unique Index**
   - `(product_id, raw_material_id)` on product_materials
   - Prevents duplicate associations
   - Enforces business rule at DB level

---

## Constraints

### NOT NULL Constraints
All critical fields have NOT NULL to ensure data integrity:
- Identification fields (id, code)
- Descriptive fields (name)
- Quantitative fields (value, quantity_in_stock, quantity_needed)

### UNIQUE Constraints
- `products.code`: Business key uniqueness
- `raw_materials.code`: Business key uniqueness
- `product_materials.(product_id, raw_material_id)`: No duplicate associations

### CHECK Constraints (Application Level)
While PostgreSQL supports CHECK constraints, we enforce these at application level for flexibility:
- `products.value > 0`
- `raw_materials.quantity_in_stock >= 0`
- `product_materials.quantity_needed > 0`

### CASCADE DELETE
- Deleting a product cascades to product_materials
- Deleting a material cascades to product_materials
- Ensures referential integrity

---

## Migration Scripts

### Initial Migration
```sql
-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_materials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "raw_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_materials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "raw_material_id" UUID NOT NULL,
    "quantity_needed" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "product_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_code_idx" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "raw_materials_code_key" ON "raw_materials"("code");

-- CreateIndex
CREATE INDEX "raw_materials_code_idx" ON "raw_materials"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_materials_product_id_raw_material_id_key" 
    ON "product_materials"("product_id", "raw_material_id");

-- CreateIndex
CREATE INDEX "product_materials_product_id_idx" ON "product_materials"("product_id");

-- CreateIndex
CREATE INDEX "product_materials_raw_material_id_idx" ON "product_materials"("raw_material_id");

-- AddForeignKey
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_product_id_fkey" 
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_raw_material_id_fkey" 
    FOREIGN KEY ("raw_material_id") REFERENCES "raw_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Seed Data (Optional)

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create raw materials
  const plastic = await prisma.rawMaterial.create({
    data: {
      code: 'RM001',
      name: 'Plastic Resin',
      quantityInStock: 1000,
    },
  });

  const ink = await prisma.rawMaterial.create({
    data: {
      code: 'RM002',
      name: 'Printing Ink',
      quantityInStock: 500,
    },
  });

  const adhesive = await prisma.rawMaterial.create({
    data: {
      code: 'RM003',
      name: 'Adhesive',
      quantityInStock: 200,
    },
  });

  // Create products
  const bag = await prisma.product.create({
    data: {
      code: 'PROD001',
      name: 'Plastic Bag',
      value: 10.50,
      materials: {
        create: [
          { rawMaterialId: plastic.id, quantityNeeded: 2 },
          { rawMaterialId: ink.id, quantityNeeded: 1 },
        ],
      },
    },
  });

  const label = await prisma.product.create({
    data: {
      code: 'PROD002',
      name: 'Product Label',
      value: 5.25,
      materials: {
        create: [
          { rawMaterialId: plastic.id, quantityNeeded: 1 },
          { rawMaterialId: adhesive.id, quantityNeeded: 1 },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Query Patterns

### Common Queries

#### 1. Get Product with Materials
```typescript
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: {
    materials: {
      include: {
        rawMaterial: true,
      },
    },
  },
});
```

#### 2. Get Material with Products Using It
```typescript
const material = await prisma.rawMaterial.findUnique({
  where: { id: materialId },
  include: {
    products: {
      include: {
        product: true,
      },
    },
  },
});
```

#### 3. Production Calculation Query
```typescript
const productsWithMaterials = await prisma.product.findMany({
  include: {
    materials: {
      include: {
        rawMaterial: true,
      },
    },
  },
});
```

---

## Performance Considerations

### Optimization Strategies

1. **Use Indexes Effectively**
   - All foreign keys indexed
   - Business keys (codes) indexed
   - Composite index for uniqueness

2. **Avoid N+1 Queries**
   - Use Prisma's `include` for eager loading
   - Batch operations when possible

3. **Connection Pooling**
   - Configure Prisma connection pool
   - Default: 10 connections
   - Adjust based on load

4. **Query Optimization**
   - Select only needed fields
   - Use pagination for large datasets
   - Implement caching for production calculations

### Example: Efficient Pagination
```typescript
const products = await prisma.product.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

---

## Backup and Recovery

### Backup Strategy
```bash
# Backup database
pg_dump -U username -d inventory_db > backup_$(date +%Y%m%d).sql

# Restore database
psql -U username -d inventory_db < backup_20260204.sql
```

### Migration Rollback
```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back [migration_name]
```

---

## Database Maintenance

### Regular Tasks

1. **Vacuum (PostgreSQL)**
   ```sql
   VACUUM ANALYZE products;
   VACUUM ANALYZE raw_materials;
   VACUUM ANALYZE product_materials;
   ```

2. **Index Maintenance**
   ```sql
   REINDEX TABLE products;
   REINDEX TABLE raw_materials;
   REINDEX TABLE product_materials;
   ```

3. **Statistics Update**
   ```sql
   ANALYZE products;
   ANALYZE raw_materials;
   ANALYZE product_materials;
   ```

---

## Future Enhancements

### Potential Schema Extensions

1. **Audit Log Table**
   - Track all changes to critical data
   - Who, what, when information

2. **Stock Movement History**
   - Track material stock changes over time
   - Support for inventory audits

3. **User Management**
   - Add users, roles, permissions
   - Row-level security

4. **Production Orders**
   - Track actual production runs
   - Record material consumption

5. **Suppliers**
   - Track material suppliers
   - Purchase order management

6. **Product Categories**
   - Organize products hierarchically
   - Better reporting and filtering

---

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public

Example:
postgresql://admin:password@localhost:5432/inventory_db?schema=public
```

---

## Environment-Specific Configurations

### Development
```env
DATABASE_URL="postgresql://dev_user:dev_pass@localhost:5432/inventory_dev"
```

### Testing
```env
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/inventory_test"
```

### Production
```env
DATABASE_URL="postgresql://prod_user:secure_pass@prod-server:5432/inventory_prod?sslmode=require"
```

---

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
   ```bash
   npx prisma migrate reset  # Warning: deletes all data
   ```

2. **Connection Issues**
   - Verify DATABASE_URL
   - Check PostgreSQL is running
   - Confirm network connectivity

3. **Schema Drift**
   ```bash
   npx prisma db push  # For development only
   ```

4. **Prisma Client Out of Sync**
   ```bash
   npx prisma generate
   ```
