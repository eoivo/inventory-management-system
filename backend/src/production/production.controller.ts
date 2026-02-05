import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { ProductionResponseDto } from './dto';

@ApiTags('production')
@Controller('production')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) { }

    @Get('suggestions')
    @ApiOperation({
        summary: 'Get production suggestions based on available stock',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns optimized production suggestions',
        type: ProductionResponseDto,
    })
    getSuggestions(): Promise<ProductionResponseDto> {
        return this.productionService.calculateProductionSuggestions();
    }
}
