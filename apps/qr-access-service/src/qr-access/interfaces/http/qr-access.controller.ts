import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateQrAccessDto } from '../../application/dto/create-qr-access.dto';
import { ValidateQrAccessDto } from '../../application/dto/validate-qr-access.dto';
import { QrAccessService } from '../../application/use-cases/qr-access.service';

@ApiTags('QR Access')
@ApiBearerAuth()
@Controller('qr-access')
export class QrAccessController {
  constructor(private readonly qrAccessService: QrAccessService) {}

  @Post()
  @ApiOperation({ summary: 'Generate a QR access code' })
  generate(@Body() dto: CreateQrAccessDto) {
    return this.qrAccessService.generate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List generated QR access codes' })
  findAll() {
    return this.qrAccessService.findAll();
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a QR access code and register the attempt' })
  validate(@Body() dto: ValidateQrAccessDto) {
    return this.qrAccessService.validate(dto);
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: 'Revoke a QR access code' })
  @ApiParam({ name: 'id', example: '3f8013b7-a6fb-41f0-8ad6-0c52e7029c0c' })
  revoke(@Param('id') id: string) {
    return this.qrAccessService.revoke(id);
  }

  @Get('logs')
  @ApiOperation({ summary: 'List QR access attempts and logs' })
  findLogs() {
    return this.qrAccessService.findLogs();
  }
}
