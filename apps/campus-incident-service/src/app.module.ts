import { Module } from '@nestjs/common';
import { IncidentsController } from './presentation/controllers/incidents.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [IncidentsController, HealthController],
  providers: [],
})
export class AppModule {}