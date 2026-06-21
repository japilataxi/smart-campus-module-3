import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrAccessController } from './interfaces/http/qr-access.controller';
import { QrAccessService } from './application/use-cases/qr-access.service';
import { QrAccessCodeEntity } from './infrastructure/entities/qr-access-code.entity';
import { QrAccessLogEntity } from './infrastructure/entities/qr-access-log.entity';
import { TypeOrmQrAccessRepository } from './infrastructure/repositories/typeorm-qr-access.repository';
import { QR_ACCESS_REPOSITORY } from './application/ports/qr-access-repository.port';
import { RedisCacheService } from '../common/cache/redis-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([QrAccessCodeEntity, QrAccessLogEntity])],
  controllers: [QrAccessController],
  providers: [
    QrAccessService,
    RedisCacheService,
    {
      provide: QR_ACCESS_REPOSITORY,
      useClass: TypeOrmQrAccessRepository,
    },
  ],
})
export class QrAccessModule {}
