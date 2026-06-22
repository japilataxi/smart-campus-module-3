import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheService } from '../common/cache/redis-cache.service';
import { LoggingModule } from '../common/logging/logging.module';
import { SPACE_REPOSITORY } from './application/ports/space-repository.port';
import { SpaceService } from './application/use-cases/space.service';
import { SpaceEntity } from './infrastructure/entities/space.entity';
import { TypeOrmSpaceRepository } from './infrastructure/repositories/typeorm-space.repository';
import { SpaceController } from './interfaces/http/space.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceEntity]), LoggingModule],
  controllers: [SpaceController],
  providers: [
    SpaceService,
    RedisCacheService,
    {
      provide: SPACE_REPOSITORY,
      useClass: TypeOrmSpaceRepository,
    },
  ],
  exports: [SpaceService],
})
export class SpaceModule {}
