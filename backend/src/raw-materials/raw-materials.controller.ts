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
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto, UpdateRawMaterialDto } from './dto';

@ApiTags('raw-materials')
@Controller('raw-materials')
export class RawMaterialsController {
    constructor(private readonly rawMaterialsService: RawMaterialsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new raw material' })
    @ApiResponse({ status: 201, description: 'Material created successfully' })
    @ApiResponse({ status: 409, description: 'Material code already exists' })
    create(@Body() createRawMaterialDto: CreateRawMaterialDto) {
        return this.rawMaterialsService.create(createRawMaterialDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all raw materials' })
    @ApiResponse({ status: 200, description: 'Returns all raw materials' })
    findAll() {
        return this.rawMaterialsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a raw material by ID' })
    @ApiResponse({ status: 200, description: 'Returns the raw material' })
    @ApiResponse({ status: 404, description: 'Raw material not found' })
    findOne(@Param('id') id: string) {
        return this.rawMaterialsService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a raw material' })
    @ApiResponse({ status: 200, description: 'Material updated successfully' })
    @ApiResponse({ status: 404, description: 'Raw material not found' })
    @ApiResponse({ status: 409, description: 'Material code already exists' })
    update(
        @Param('id') id: string,
        @Body() updateRawMaterialDto: UpdateRawMaterialDto,
    ) {
        return this.rawMaterialsService.update(id, updateRawMaterialDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a raw material' })
    @ApiResponse({ status: 204, description: 'Material deleted successfully' })
    @ApiResponse({ status: 404, description: 'Raw material not found' })
    remove(@Param('id') id: string) {
        return this.rawMaterialsService.remove(id);
    }
}
