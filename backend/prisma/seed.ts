import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.productMaterial.deleteMany();
    await prisma.product.deleteMany();
    await prisma.rawMaterial.deleteMany();

    // Create raw materials
    const plastic = await prisma.rawMaterial.create({
        data: {
            code: 'RM001',
            name: 'Resina Plástica',
            quantityInStock: 1000,
        },
    });

    const ink = await prisma.rawMaterial.create({
        data: {
            code: 'RM002',
            name: 'Tinta de Impressão',
            quantityInStock: 500,
        },
    });

    const adhesive = await prisma.rawMaterial.create({
        data: {
            code: 'RM003',
            name: 'Adesivo Industrial',
            quantityInStock: 200,
        },
    });

    const aluminum = await prisma.rawMaterial.create({
        data: {
            code: 'RM004',
            name: 'Folha de Alumínio',
            quantityInStock: 300,
        },
    });

    const paper = await prisma.rawMaterial.create({
        data: {
            code: 'RM005',
            name: 'Papel Kraft',
            quantityInStock: 800,
        },
    });

    console.log('Raw materials created');

    // Create products with materials
    await prisma.product.create({
        data: {
            code: 'PROD001',
            name: 'Sacola Plástica Premium',
            value: 15.50,
            materials: {
                create: [
                    { rawMaterialId: plastic.id, quantityNeeded: 3 },
                    { rawMaterialId: ink.id, quantityNeeded: 1 },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            code: 'PROD002',
            name: 'Etiqueta Adesiva',
            value: 8.25,
            materials: {
                create: [
                    { rawMaterialId: paper.id, quantityNeeded: 2 },
                    { rawMaterialId: adhesive.id, quantityNeeded: 1 },
                    { rawMaterialId: ink.id, quantityNeeded: 1 },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            code: 'PROD003',
            name: 'Embalagem Flexível',
            value: 25.00,
            materials: {
                create: [
                    { rawMaterialId: plastic.id, quantityNeeded: 4 },
                    { rawMaterialId: aluminum.id, quantityNeeded: 2 },
                    { rawMaterialId: ink.id, quantityNeeded: 2 },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            code: 'PROD004',
            name: 'Saco de Papel',
            value: 5.75,
            materials: {
                create: [
                    { rawMaterialId: paper.id, quantityNeeded: 3 },
                    { rawMaterialId: adhesive.id, quantityNeeded: 1 },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            code: 'PROD005',
            name: 'Filme Metalizado',
            value: 35.00,
            materials: {
                create: [
                    { rawMaterialId: plastic.id, quantityNeeded: 5 },
                    { rawMaterialId: aluminum.id, quantityNeeded: 3 },
                ],
            },
        },
    });

    console.log('Products created');
    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
