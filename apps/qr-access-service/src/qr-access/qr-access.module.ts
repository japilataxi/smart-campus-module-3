import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QrAccessLog } from './entities/qr-access-log.entity';
import { QrAccessController } from './qr-access.controller';
import { QrAccessService } from './qr-access.service';

@Module({
  imports: [TypeOrmModule.forFeature([QrAccessLog])],
  controllers: [QrAccessController],
  providers: [QrAccessService],
})
export class QrAccessModule {}

