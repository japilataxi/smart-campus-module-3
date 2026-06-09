import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QrAccessCacheService } from './cache/qr-access-cache.service';
import { QrAccessLog } from './entities/qr-access-log.entity';
import { QR_ACCESS_CACHE } from './ports/qr-access-cache.port';
import { QR_ACCESS_REPOSITORY } from './ports/qr-access-repository.port';
import { QrAccessController } from './qr-access.controller';
import { QrAccessService } from './qr-access.service';
import { TypeOrmQrAccessRepository } from './repositories/typeorm-qr-access.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QrAccessLog])],
  controllers: [QrAccessController],
  providers: [
    QrAccessService,
    QrAccessCacheService,
    TypeOrmQrAccessRepository,
    {
      provide: QR_ACCESS_REPOSITORY,
      useExisting: TypeOrmQrAccessRepository,
    },
    {
      provide: QR_ACCESS_CACHE,
      useExisting: QrAccessCacheService,
    },
  ],
})
export class QrAccessModule {}

