import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { GenerateQrAccessDto } from './dto/generate-qr-access.dto';
import { QrAccessResponseDto } from './dto/qr-access-response.dto';
import { RevokeQrAccessDto } from './dto/revoke-qr-access.dto';
import { ValidateQrAccessDto } from './dto/validate-qr-access.dto';
import { QrAccessService } from './qr-access.service';

@ApiTags('QR Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('qr-access')
export class QrAccessController {
  constructor(private readonly qrAccessService: QrAccessService) {}

  @Post('generate')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Generate a QR access record' })
  @ApiCreatedResponse({ type: QrAccessResponseDto })
  generate(@Body() dto: GenerateQrAccessDto) {
    return this.qrAccessService.generate(dto);
  }

  @Post('validate')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Validate a QR access record' })
  @ApiOkResponse({ type: QrAccessResponseDto })
  validate(@Body() dto: ValidateQrAccessDto) {
    return this.qrAccessService.validate(dto);
  }

  @Patch(':id/revoke')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Revoke an active QR access record' })
  @ApiOkResponse({ type: QrAccessResponseDto })
  revoke(@Param('id') id: string, @Body() dto: RevokeQrAccessDto) {
    return this.qrAccessService.revoke(id, dto.reason);
  }

  @Get('logs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List QR access logs' })
  @ApiOkResponse({ type: QrAccessResponseDto, isArray: true })
  findLogs() {
    return this.qrAccessService.findLogs();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  @ApiOperation({ summary: 'Get a QR access record by ID' })
  @ApiOkResponse({ type: QrAccessResponseDto })
  findById(@Param('id') id: string) {
    return this.qrAccessService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a QR access record by ID' })
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.qrAccessService.remove(id);
  }
}

