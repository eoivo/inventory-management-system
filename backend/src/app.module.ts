import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { ProductsModule } from './products';
import { RawMaterialsModule } from './raw-materials';
import { ProductMaterialsModule } from './product-materials';
import { ProductionModule } from './production';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    RawMaterialsModule,
    ProductMaterialsModule,
    ProductionModule,
  ],
})
export class AppModule { }
