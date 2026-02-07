import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database';
import { ProductsModule } from './products';
import { RawMaterialsModule } from './raw-materials';
import { ProductMaterialsModule } from './product-materials';
import { ProductionModule } from './production';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    RawMaterialsModule,
    ProductMaterialsModule,
    ProductionModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
