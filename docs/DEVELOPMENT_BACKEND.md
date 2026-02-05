# Backend Development Guide - Internal Documentation

## Architecture Overview

### Technology Stack
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **ORM:** Prisma 5.x
- **Database:** PostgreSQL 16.x
- **Testing:** Jest + Supertest
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger (optional enhancement)

### Design Patterns
1. **Repository Pattern:** Data access abstraction
2. **Service Layer:** Business logic encapsulation
3. **DTO Pattern:** Data transfer and validation
4. **Dependency Injection:** NestJS native DI
5. **Module Pattern:** Feature-based organization

---

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── products/                  # Products module
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── product-response.dto.ts
│   │   └── entities/
│   │       └── product.entity.ts
│   │
│   ├── raw-materials/             # Raw materials module
│   │   ├── raw-materials.module.ts
│   │   ├── raw-materials.controller.ts
│   │   ├── raw-materials.service.ts
│   │   ├── dto/
│   │   │   ├── create-raw-material.dto.ts
│   │   │   ├── update-raw-material.dto.ts
│   │   │   └── raw-material-response.dto.ts
│   │   └── entities/
│   │       └── raw-material.entity.ts
│   │
│   ├── product-materials/         # Associations module
│   │   ├── product-materials.module.ts
│   │   ├── product-materials.controller.ts
│   │   ├── product-materials.service.ts
│   │   ├── dto/
│   │   │   ├── create-product-material.dto.ts
│   │   │   ├── update-product-material.dto.ts
│   │   │   └── product-material-response.dto.ts
│   │   └── entities/
│   │       └── product-material.entity.ts
│   │
│   ├── production/                # Production suggestions module
│   │   ├── production.module.ts
│   │   ├── production.controller.ts
│   │   ├── production.service.ts
│   │   ├── dto/
│   │   │   ├── production-suggestion.dto.ts
│   │   │   └── production-response.dto.ts
│   │   └── interfaces/
│   │       └── production-calculation.interface.ts
│   │
│   ├── database/                  # Database configuration
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   │
│   └── common/                    # Shared resources
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── transform.interceptor.ts
│       ├── pipes/
│       │   └── validation.pipe.ts
│       └── decorators/
│           └── api-response.decorator.ts
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Seed data (optional)
│
├── test/
│   ├── unit/                      # Unit tests
│   └── integration/               # Integration tests
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Module Implementation Details

### 1. Products Module (RF001)

#### Products Controller
```typescript
@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
```

#### Products Service
```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        materials: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Validate existence

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validate existence

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
```

#### Create Product DTO
```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  value: number;
}
```

---

### 2. Raw Materials Module (RF002)

Similar structure to Products module with appropriate fields:
- `code` (string, unique)
- `name` (string)
- `quantityInStock` (integer, non-negative)

**Key Differences:**
- Validation: `quantityInStock` must be >= 0
- Business logic: Stock update operations
- Relationships: Can be used in multiple products

---

### 3. Product Materials Module (RF003)

#### Product Materials Controller
```typescript
@Controller('products/:productId/materials')
@ApiTags('product-materials')
export class ProductMaterialsController {
  constructor(
    private readonly productMaterialsService: ProductMaterialsService,
  ) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() createDto: CreateProductMaterialDto,
  ) {
    return this.productMaterialsService.create(productId, createDto);
  }

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.productMaterialsService.findAllByProduct(productId);
  }

  @Put(':materialId')
  update(
    @Param('productId') productId: string,
    @Param('materialId') materialId: string,
    @Body() updateDto: UpdateProductMaterialDto,
  ) {
    return this.productMaterialsService.update(
      productId,
      materialId,
      updateDto,
    );
  }

  @Delete(':materialId')
  remove(
    @Param('productId') productId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.productMaterialsService.remove(productId, materialId);
  }
}
```

#### Product Materials Service
```typescript
@Injectable()
export class ProductMaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(
    productId: string,
    createDto: CreateProductMaterialDto,
  ) {
    // Validate product exists
    await this.validateProductExists(productId);
    
    // Validate raw material exists
    await this.validateRawMaterialExists(createDto.rawMaterialId);

    // Check if association already exists
    const existing = await this.prisma.productMaterial.findUnique({
      where: {
        productId_rawMaterialId: {
          productId,
          rawMaterialId: createDto.rawMaterialId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'This material is already associated with the product',
      );
    }

    return this.prisma.productMaterial.create({
      data: {
        productId,
        rawMaterialId: createDto.rawMaterialId,
        quantityNeeded: createDto.quantityNeeded,
      },
      include: {
        rawMaterial: true,
      },
    });
  }

  private async validateProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  private async validateRawMaterialExists(rawMaterialId: string) {
    const material = await this.prisma.rawMaterial.findUnique({
      where: { id: rawMaterialId },
    });

    if (!material) {
      throw new NotFoundException(
        `Raw material with ID ${rawMaterialId} not found`,
      );
    }
  }
}
```

---

### 4. Production Module (RF004) - CORE LOGIC

#### Production Controller
```typescript
@Controller('production')
@ApiTags('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get('suggestions')
  getSuggestions() {
    return this.productionService.calculateProductionSuggestions();
  }
}
```

#### Production Service - Algorithm Implementation
```typescript
@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async calculateProductionSuggestions(): Promise<ProductionResponseDto> {
    // Step 1: Fetch all products with their material requirements
    const products = await this.prisma.product.findMany({
      include: {
        materials: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    // Step 2: Calculate how many of each product can be produced
    const productionCapacity = products.map((product) => {
      const materialConstraints = product.materials.map((pm) => {
        const available = pm.rawMaterial.quantityInStock;
        const needed = pm.quantityNeeded;
        return Math.floor(available / needed);
      });

      const maxProducible =
        materialConstraints.length > 0 ? Math.min(...materialConstraints) : 0;

      return {
        product,
        maxQuantity: maxProducible,
        unitValue: product.value,
        totalValue: maxProducible * product.value,
      };
    });

    // Step 3: Filter producible products and sort by unit value (descending)
    const producibleProducts = productionCapacity
      .filter((p) => p.maxQuantity > 0)
      .sort((a, b) => b.unitValue - a.unitValue);

    // Step 4: Apply greedy algorithm to optimize production
    const suggestions = this.optimizeProduction(producibleProducts);

    // Step 5: Calculate total value
    const totalValue = suggestions.reduce(
      (sum, s) => sum + s.totalValue,
      0,
    );

    return {
      suggestions: suggestions.map((s) => ({
        productId: s.product.id,
        productCode: s.product.code,
        productName: s.product.name,
        unitValue: s.unitValue,
        quantityToProduce: s.quantityAllocated,
        totalValue: s.totalValue,
        materialsUsed: s.materialsUsed,
      })),
      totalProductionValue: totalValue,
      timestamp: new Date(),
    };
  }

  private optimizeProduction(
    producibleProducts: ProductionCapacity[],
  ): AllocatedProduction[] {
    const allocated: AllocatedProduction[] = [];
    const stockTracker = new Map<string, number>();

    // Initialize stock tracker with current quantities
    for (const prod of producibleProducts) {
      for (const material of prod.product.materials) {
        stockTracker.set(
          material.rawMaterialId,
          material.rawMaterial.quantityInStock,
        );
      }
    }

    // Greedy allocation: prioritize by highest unit value
    for (const productCapacity of producibleProducts) {
      const { product, maxQuantity } = productCapacity;

      // Calculate how much can actually be produced with current tracked stock
      let actualProducible = maxQuantity;

      for (const material of product.materials) {
        const currentStock = stockTracker.get(material.rawMaterialId) || 0;
        const possibleWithThisMaterial = Math.floor(
          currentStock / material.quantityNeeded,
        );
        actualProducible = Math.min(actualProducible, possibleWithThisMaterial);
      }

      if (actualProducible > 0) {
        // Allocate production
        const materialsUsed: MaterialUsage[] = [];

        for (const material of product.materials) {
          const quantityUsed = material.quantityNeeded * actualProducible;
          const currentStock = stockTracker.get(material.rawMaterialId) || 0;
          stockTracker.set(
            material.rawMaterialId,
            currentStock - quantityUsed,
          );

          materialsUsed.push({
            rawMaterialId: material.rawMaterialId,
            rawMaterialCode: material.rawMaterial.code,
            rawMaterialName: material.rawMaterial.name,
            quantityNeeded: material.quantityNeeded,
            totalQuantityUsed: quantityUsed,
          });
        }

        allocated.push({
          product: product,
          quantityAllocated: actualProducible,
          unitValue: product.value,
          totalValue: actualProducible * product.value,
          materialsUsed,
        });
      }
    }

    return allocated;
  }
}

// Interfaces for type safety
interface ProductionCapacity {
  product: any;
  maxQuantity: number;
  unitValue: number;
  totalValue: number;
}

interface AllocatedProduction {
  product: any;
  quantityAllocated: number;
  unitValue: number;
  totalValue: number;
  materialsUsed: MaterialUsage[];
}

interface MaterialUsage {
  rawMaterialId: string;
  rawMaterialCode: string;
  rawMaterialName: string;
  quantityNeeded: number;
  totalQuantityUsed: number;
}
```

---

## Database Configuration

### Prisma Service
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Database Module
```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

---

## Error Handling

### Global Exception Filter
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

## Validation

### Global Validation Pipe Configuration
```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

---

## Environment Configuration

### .env.example
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db"

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Testing Strategy

### Unit Tests
```typescript
describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto = {
        code: 'PROD001',
        name: 'Test Product',
        value: 100,
      };

      jest.spyOn(prisma.product, 'create').mockResolvedValue({
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createDto);

      expect(result).toHaveProperty('id');
      expect(result.code).toBe(createDto.code);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

### Integration Tests
```typescript
describe('Products API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/products (POST)', () => {
    it('should create a product', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          code: 'PROD001',
          name: 'Test Product',
          value: 100,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.code).toBe('PROD001');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## API Response Standards

### Success Response Format
```typescript
{
  "data": {
    "id": "uuid",
    "code": "PROD001",
    "name": "Product Name",
    "value": 100
  },
  "message": "Product created successfully",
  "timestamp": "2026-02-04T10:00:00.000Z"
}
```

### Error Response Format
```typescript
{
  "statusCode": 404,
  "message": "Product with ID xyz not found",
  "timestamp": "2026-02-04T10:00:00.000Z",
  "path": "/products/xyz"
}
```

---

## Performance Considerations

### Database Indexing
- Index on `products.code` (unique queries)
- Index on `rawMaterials.code` (unique queries)
- Composite index on `productMaterials.productId + rawMaterialId`

### Query Optimization
- Use `include` wisely to avoid N+1 queries
- Consider pagination for large datasets
- Cache production suggestions if data doesn't change frequently

---

## Security Best Practices

1. **Input Validation:** All DTOs validated with class-validator
2. **SQL Injection:** Prisma ORM prevents SQL injection
3. **CORS Configuration:** Restrict origins in production
4. **Rate Limiting:** Consider implementing for production
5. **Environment Variables:** Never commit .env files

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production DATABASE_URL
- [ ] Run database migrations
- [ ] Set appropriate CORS origins
- [ ] Enable compression middleware
- [ ] Configure logging (consider Winston)
- [ ] Setup health check endpoint
- [ ] Document API base URL

---

## Development Commands

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report

# Database
npx prisma migrate dev    # Create migration
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Database GUI
npx prisma db seed        # Seed database
```

---

## Code Quality

### ESLint Configuration
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Prettier Configuration
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

---

## Monitoring and Logging

### Basic Logging Setup
```typescript
// Use NestJS built-in logger
private readonly logger = new Logger(ProductsService.name);

async create(dto: CreateProductDto) {
  this.logger.log(`Creating product with code: ${dto.code}`);
  
  try {
    const product = await this.prisma.product.create({ data: dto });
    this.logger.log(`Product created successfully: ${product.id}`);
    return product;
  } catch (error) {
    this.logger.error(`Failed to create product: ${error.message}`);
    throw error;
  }
}
```
