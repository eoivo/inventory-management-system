import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductMaterialsService } from './product-materials.service';
import { CreateProductMaterialDto, UpdateProductMaterialDto } from './dto';

@ApiTags('product-materials')
@Controller('products/:productId/materials')
export class ProductMaterialsController {
    constructor(
        private readonly productMaterialsService: ProductMaterialsService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Add a material to a product' })
    @ApiResponse({ status: 201, description: 'Material associated successfully' })
    @ApiResponse({ status: 404, description: 'Product or material not found' })
    @ApiResponse({ status: 409, description: 'Material already associated' })
    create(
        @Param('productId') productId: string,
        @Body() createDto: CreateProductMaterialDto,
    ) {
        return this.productMaterialsService.create(productId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all materials associated with a product' })
    @ApiResponse({ status: 200, description: 'Returns associated materials' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findAll(@Param('productId') productId: string) {
        return this.productMaterialsService.findAllByProduct(productId);
    }

    @Put(':rawMaterialId')
    @ApiOperation({ summary: 'Update material quantity for a product' })
    @ApiResponse({ status: 200, description: 'Association updated successfully' })
    @ApiResponse({ status: 404, description: 'Association not found' })
    update(
        @Param('productId') productId: string,
        @Param('rawMaterialId') rawMaterialId: string,
        @Body() updateDto: UpdateProductMaterialDto,
    ) {
        return this.productMaterialsService.update(
            productId,
            rawMaterialId,
            updateDto,
        );
    }

    @Delete(':rawMaterialId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove a material from a product' })
    @ApiResponse({ status: 204, description: 'Material removed successfully' })
    @ApiResponse({ status: 404, description: 'Association not found' })
    remove(
        @Param('productId') productId: string,
        @Param('rawMaterialId') rawMaterialId: string,
    ) {
        return this.productMaterialsService.remove(productId, rawMaterialId);
    }
}
