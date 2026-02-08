import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Clearing core business data (keeping users)...');

    // Due to Cascade deletes in the schema, deleting Product and RawMaterial 
    // should automatically clear ProductMaterial, but we'll be explicit.

    const pmCount = await prisma.productMaterial.deleteMany();
    console.log(`Deleted ${pmCount.count} product-material associations.`);

    const pCount = await prisma.product.deleteMany();
    console.log(`Deleted ${pCount.count} products.`);

    const rmCount = await prisma.rawMaterial.deleteMany();
    console.log(`Deleted ${rmCount.count} raw materials.`);

    console.log('Database cleaned successfully. User table was preserved.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
