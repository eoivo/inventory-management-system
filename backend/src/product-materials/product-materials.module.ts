import { Module } from '@nestjs/common';
import { ProductMaterialsController } from './product-materials.controller';
import { ProductMaterialsService } from './product-materials.service';

@Module({
    controllers: [ProductMaterialsController],
    providers: [ProductMaterialsService],
    exports: [ProductMaterialsService],
})
export class ProductMaterialsModule { }
