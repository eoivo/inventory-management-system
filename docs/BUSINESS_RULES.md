# Business Rules Documentation

## Overview

This document defines all business rules, validation rules, and domain logic for the Inventory Management System. These rules ensure data integrity, enforce business constraints, and guide system behavior.

---

## 1. Product Management Rules

### BR-PROD-001: Product Code Uniqueness
**Rule:** Each product must have a unique code across the entire system.

**Validation:**
- Check uniqueness before creating a product
- Check uniqueness before updating a product code
- Case-sensitive comparison
- No whitespace allowed in codes

**Error Message:** "Product code already exists. Please use a different code."

**Implementation:**
```typescript
// Database level: UNIQUE constraint on products.code
// Application level: Check before INSERT/UPDATE
const existingProduct = await prisma.product.findUnique({
  where: { code: newCode }
});

if (existingProduct && existingProduct.id !== productId) {
  throw new ConflictException('Product code already exists');
}
```

---

### BR-PROD-002: Product Value Validation
**Rule:** Product value must be a positive number greater than zero.

**Validation:**
- Must be numeric
- Must be > 0
- Maximum 10 digits (8 before decimal, 2 after)
- Example valid values: 0.01, 10.50, 99999999.99

**Error Message:** "Product value must be a positive number greater than zero."

**Implementation:**
```typescript
if (value <= 0) {
  throw new BadRequestException('Product value must be positive');
}

if (value > 99999999.99) {
  throw new BadRequestException('Product value exceeds maximum allowed');
}
```

---

### BR-PROD-003: Product Name Requirements
**Rule:** Product name must be provided and cannot be empty.

**Validation:**
- Minimum length: 1 character (after trimming)
- Maximum length: 255 characters
- Must not be only whitespace
- Special characters allowed

**Error Message:** "Product name is required and cannot be empty."

**Implementation:**
```typescript
const trimmedName = name.trim();

if (trimmedName.length === 0) {
  throw new BadRequestException('Product name cannot be empty');
}

if (trimmedName.length > 255) {
  throw new BadRequestException('Product name is too long');
}
```

---

### BR-PROD-004: Product Code Format
**Rule:** Product codes should follow a consistent format.

**Recommended Format:** PRODXXX (where XXX is a number or alphanumeric)

**Validation:**
- Alphanumeric characters only (A-Z, 0-9)
- No spaces
- Case-insensitive storage (stored as uppercase)
- Maximum 50 characters

**Error Message:** "Product code must contain only letters and numbers."

**Implementation:**
```typescript
const codeRegex = /^[A-Z0-9]+$/i;

if (!codeRegex.test(code)) {
  throw new BadRequestException('Product code must be alphanumeric');
}

// Store as uppercase for consistency
const normalizedCode = code.toUpperCase();
```

---

### BR-PROD-005: Product Deletion with Dependencies
**Rule:** When a product is deleted, all its material associations are automatically removed.

**Behavior:**
- Cascade delete to product_materials table
- Does NOT delete the raw materials themselves
- Irreversible operation

**Warning Message:** "Deleting this product will remove all its material associations. This action cannot be undone."

**Implementation:**
```typescript
// Handled by database CASCADE constraint
// Frontend should show confirmation dialog
```

---

## 2. Raw Material Management Rules

### BR-MAT-001: Material Code Uniqueness
**Rule:** Each raw material must have a unique code across the entire system.

**Validation:**
- Check uniqueness before creating a material
- Check uniqueness before updating a material code
- Case-sensitive comparison
- No whitespace allowed in codes

**Error Message:** "Material code already exists. Please use a different code."

**Implementation:**
```typescript
const existingMaterial = await prisma.rawMaterial.findUnique({
  where: { code: newCode }
});

if (existingMaterial && existingMaterial.id !== materialId) {
  throw new ConflictException('Material code already exists');
}
```

---

### BR-MAT-002: Stock Quantity Validation
**Rule:** Stock quantity must be a non-negative integer.

**Validation:**
- Must be an integer (whole number)
- Must be >= 0
- Cannot be negative
- Maximum value: 2,147,483,647 (PostgreSQL INTEGER limit)

**Error Message:** "Stock quantity must be a non-negative whole number."

**Implementation:**
```typescript
if (quantityInStock < 0) {
  throw new BadRequestException('Stock quantity cannot be negative');
}

if (!Number.isInteger(quantityInStock)) {
  throw new BadRequestException('Stock quantity must be a whole number');
}
```

---

### BR-MAT-003: Material Name Requirements
**Rule:** Material name must be provided and cannot be empty.

**Validation:**
- Minimum length: 1 character (after trimming)
- Maximum length: 255 characters
- Must not be only whitespace
- Special characters allowed

**Error Message:** "Material name is required and cannot be empty."

---

### BR-MAT-004: Material Code Format
**Rule:** Material codes should follow a consistent format.

**Recommended Format:** RMXXX (where RM = Raw Material, XXX = identifier)

**Validation:**
- Alphanumeric characters only (A-Z, 0-9)
- No spaces
- Case-insensitive storage (stored as uppercase)
- Maximum 50 characters

---

### BR-MAT-005: Material Deletion with Dependencies
**Rule:** When a material is deleted, all product associations using it are removed.

**Behavior:**
- Cascade delete to product_materials table
- May affect multiple products
- Irreversible operation

**Warning Message:** "This material is used in X product(s). Deleting it will remove these associations. This action cannot be undone."

**Implementation:**
```typescript
// Before deletion, check usage
const usage = await prisma.productMaterial.count({
  where: { rawMaterialId: materialId }
});

if (usage > 0) {
  // Return warning to frontend
  return {
    canDelete: true,
    warning: `This material is used in ${usage} product(s)`,
    affectedProducts: usage
  };
}
```

---

### BR-MAT-006: Stock Update Rules
**Rule:** Stock updates should maintain non-negative values.

**Scenarios:**
1. **Adding stock:** Always allowed (increases quantity)
2. **Removing stock:** Only if result >= 0
3. **Setting stock:** New value must be >= 0

**Error Message:** "Cannot reduce stock below zero. Insufficient quantity available."

**Implementation:**
```typescript
const currentStock = material.quantityInStock;
const newStock = currentStock + adjustment;

if (newStock < 0) {
  throw new BadRequestException('Insufficient stock for this operation');
}
```

---

## 3. Product-Material Association Rules

### BR-ASSOC-001: Unique Product-Material Pair
**Rule:** A specific material can only be associated with a product once.

**Validation:**
- Check for existing association before creating
- Composite unique key: (productId, rawMaterialId)
- If association exists, update quantity instead

**Error Message:** "This material is already associated with the product. Update the existing association instead."

**Implementation:**
```typescript
const existing = await prisma.productMaterial.findUnique({
  where: {
    productId_rawMaterialId: {
      productId,
      rawMaterialId
    }
  }
});

if (existing) {
  throw new ConflictException('Material already associated with product');
}
```

---

### BR-ASSOC-002: Quantity Needed Validation
**Rule:** Quantity needed must be a positive integer.

**Validation:**
- Must be an integer (whole number)
- Must be > 0
- Cannot be negative or zero
- Maximum value: 2,147,483,647

**Error Message:** "Quantity needed must be a positive whole number greater than zero."

**Implementation:**
```typescript
if (quantityNeeded <= 0) {
  throw new BadRequestException('Quantity needed must be positive');
}

if (!Number.isInteger(quantityNeeded)) {
  throw new BadRequestException('Quantity needed must be a whole number');
}
```

---

### BR-ASSOC-003: Product Existence Validation
**Rule:** Cannot associate materials with a non-existent product.

**Validation:**
- Verify product exists before creating association
- Return 404 if product not found

**Error Message:** "Product not found. Cannot create material association."

---

### BR-ASSOC-004: Material Existence Validation
**Rule:** Cannot associate a non-existent material with a product.

**Validation:**
- Verify material exists before creating association
- Return 404 if material not found

**Error Message:** "Material not found. Cannot create association."

---

### BR-ASSOC-005: Minimum Material Requirement
**Rule:** A product should have at least one material associated to be producible.

**Status:** Advisory (not enforced)

**Recommendation:** Frontend should warn if saving a product without materials.

**Warning Message:** "This product has no materials associated. It cannot be produced until materials are added."

---

## 4. Production Suggestion Rules

### BR-PROD-001: Production Calculation Method
**Rule:** Calculate maximum producible quantity based on available stock and material requirements.

**Algorithm:**
```
For each product:
  For each material in product:
    possible_with_material = floor(stock / quantity_needed)
  max_producible = minimum(possible_with_material for all materials)
```

**Example:**
```
Product A requires:
- Material X: 2 units (Stock: 100) → Can make 50
- Material Y: 3 units (Stock: 120) → Can make 40
Maximum producible: 40 (limited by Material Y)
```

---

### BR-PROD-002: Production Prioritization
**Rule:** Products with higher unit values should be prioritized for production.

**Priority Order:**
1. Sort by unit value (descending)
2. For equal values, sort by code (alphabetical)

**Rationale:** Maximizes revenue from available stock.

**Implementation:**
```typescript
const sorted = suggestions.sort((a, b) => {
  if (b.unitValue !== a.unitValue) {
    return b.unitValue - a.unitValue;
  }
  return a.productCode.localeCompare(b.productCode);
});
```

---

### BR-PROD-003: Greedy Allocation Algorithm
**Rule:** Allocate materials using a greedy approach prioritizing high-value products.

**Process:**
1. Sort products by value (highest first)
2. For each product in order:
   - Check if materials available
   - If yes, allocate maximum possible quantity
   - Deduct allocated materials from available stock
   - Continue to next product

**Advantage:** Simple, fast, prioritizes revenue
**Limitation:** May not be globally optimal

---

### BR-PROD-004: Zero Stock Handling
**Rule:** Products requiring unavailable materials are excluded from suggestions.

**Conditions for Exclusion:**
- Any required material has zero stock
- Insufficient quantity of any material
- No materials associated (cannot calculate)

**Result:** Only producible products appear in suggestions.

---

### BR-PROD-005: Production Value Calculation
**Rule:** Total production value is the sum of all suggested products' values.

**Formula:**
```
Total Value = Σ (quantity_to_produce × unit_value) for all suggestions
```

**Example:**
```
Product A: 10 units × $50 = $500
Product B: 5 units × $30 = $150
Total: $650
```

---

### BR-PROD-006: Material Consumption Display
**Rule:** Show which materials will be consumed and in what quantities for each suggested product.

**Information Provided:**
- Material name
- Material code
- Quantity needed per unit
- Total quantity that will be consumed
- Remaining stock after production (optional enhancement)

---

### BR-PROD-007: Real-Time Calculation
**Rule:** Production suggestions are calculated on-demand, not cached.

**Rationale:**
- Stock levels change frequently
- Real-time accuracy is critical
- Caching could show outdated data

**Exception:** For very large datasets, consider caching with short TTL (e.g., 1 minute).

---

## 5. Data Integrity Rules

### BR-INT-001: Referential Integrity
**Rule:** All foreign key relationships must be valid.

**Enforcement:**
- Database-level foreign key constraints
- Cascade deletes for dependent records
- Application-level validation before operations

---

### BR-INT-002: Timestamp Management
**Rule:** System automatically manages creation and update timestamps.

**Behavior:**
- `createdAt`: Set once on record creation (immutable)
- `updatedAt`: Updated automatically on every modification
- Both use UTC timezone

---

### BR-INT-003: Soft Delete (Optional Enhancement)
**Rule:** Consider soft deletes for audit trail.

**Current Implementation:** Hard deletes
**Future Enhancement:** Add `deletedAt` field and filter queries

---

## 6. Validation Rules Summary

### Products
| Field | Required | Type | Min | Max | Unique |
|-------|----------|------|-----|-----|--------|
| code | Yes | String | 1 | 50 | Yes |
| name | Yes | String | 1 | 255 | No |
| value | Yes | Decimal | 0.01 | 99999999.99 | No |

### Raw Materials
| Field | Required | Type | Min | Max | Unique |
|-------|----------|------|-----|-----|--------|
| code | Yes | String | 1 | 50 | Yes |
| name | Yes | String | 1 | 255 | No |
| quantityInStock | Yes | Integer | 0 | 2147483647 | No |

### Product Materials
| Field | Required | Type | Min | Max | Unique |
|-------|----------|------|-----|-----|--------|
| productId | Yes | UUID | - | - | Composite |
| rawMaterialId | Yes | UUID | - | - | Composite |
| quantityNeeded | Yes | Integer | 1 | 2147483647 | No |

---

## 7. Error Handling Rules

### BR-ERR-001: User-Friendly Messages
**Rule:** Error messages should be clear and actionable.

**Examples:**
- ❌ Bad: "Constraint violation: pk_products"
- ✅ Good: "Product code already exists. Please use a different code."

---

### BR-ERR-002: Error Categories
**Rule:** Classify errors appropriately.

**Categories:**
- **400 Bad Request:** Invalid input data
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Uniqueness violation
- **500 Internal Server Error:** System error

---

### BR-ERR-003: Validation Timing
**Rule:** Validate as early as possible.

**Layers:**
1. **Frontend:** Immediate user feedback
2. **API (DTO):** Request validation
3. **Service:** Business logic validation
4. **Database:** Final constraint enforcement

---

## 8. Business Logic Edge Cases

### Edge Case 1: Product with No Materials
**Scenario:** User creates a product but doesn't add materials.

**Handling:**
- Allow creation (materials can be added later)
- Show warning in production suggestions
- Return 0 as max producible quantity

---

### Edge Case 2: Material Used in Multiple Products
**Scenario:** Limited material, multiple products need it.

**Handling:**
- Greedy algorithm prioritizes by product value
- Higher-value product gets material first
- Lower-value product may not be producible

---

### Edge Case 3: Circular Dependencies (Future)
**Scenario:** Product A requires Product B as material (not current scope).

**Handling:**
- Current design doesn't support products as materials
- Future enhancement would need cycle detection

---

### Edge Case 4: Fractional Quantities
**Scenario:** Calculation results in fractional units.

**Handling:**
- Always round down (floor function)
- Cannot produce partial units
- Example: 10.7 units → 10 units

---

### Edge Case 5: Concurrent Stock Updates
**Scenario:** Two production calculations run simultaneously.

**Handling:**
- Read-only operation (production suggestions)
- Actual production (future) would need transactions
- Database transactions ensure consistency

---

## 9. Performance Rules

### BR-PERF-001: Query Optimization
**Rule:** Minimize database queries.

**Strategy:**
- Use eager loading (Prisma includes)
- Batch operations when possible
- Index frequently queried fields

---

### BR-PERF-002: Response Time Target
**Rule:** API responses should complete within acceptable time.

**Targets:**
- CRUD operations: < 200ms
- Production calculation: < 1000ms
- Complex reports: < 3000ms

---

### BR-PERF-003: Pagination
**Rule:** Large datasets must be paginated.

**Recommendation:**
- Default page size: 20 items
- Maximum page size: 100 items
- Implement for lists exceeding 50 items

---

## 10. Security Rules

### BR-SEC-001: Input Sanitization
**Rule:** All user input must be sanitized.

**Protection Against:**
- SQL Injection (handled by Prisma ORM)
- XSS (sanitize in frontend)
- Code injection

---

### BR-SEC-002: Authentication (Future)
**Rule:** Authenticated users only.

**Current Status:** Not implemented
**Future:** JWT-based authentication

---

### BR-SEC-003: Authorization (Future)
**Rule:** Role-based access control.

**Roles (Future):**
- Admin: Full access
- Manager: View and edit
- Operator: View only

---

## 11. Audit and Compliance

### BR-AUDIT-001: Change Tracking (Future Enhancement)
**Rule:** Track who changed what and when.

**Information to Log:**
- User ID
- Timestamp
- Action (CREATE, UPDATE, DELETE)
- Old values
- New values

**Implementation:** Audit log table

---

### BR-AUDIT-002: Data Retention
**Rule:** Define how long to keep historical data.

**Recommendation:**
- Active records: Indefinitely
- Deleted records (if soft delete): 7 years
- Audit logs: 5 years

---

## 12. Business Assumptions

### Assumption 1: Single Location
**Assumption:** System manages inventory for a single location/warehouse.

**Implication:** No multi-warehouse complexity

---

### Assumption 2: No Work-in-Progress Tracking
**Assumption:** Production is instantaneous.

**Implication:** No tracking of partial completion

---

### Assumption 3: No Batch Tracking
**Assumption:** Materials are fungible (no lot/batch tracking).

**Implication:** FIFO/LIFO not required

---

### Assumption 4: Static BOM
**Assumption:** Product formulas don't change over time.

**Implication:** No version history for BOMs

---

### Assumption 5: Deterministic Calculation
**Assumption:** Production quantity calculation is deterministic.

**Implication:** Same inputs always produce same results
