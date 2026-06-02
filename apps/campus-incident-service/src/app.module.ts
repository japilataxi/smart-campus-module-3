import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './presentation/controllers/incidents.controller';
import { HealthController } from './health.controller';
import { Incident } from './domain/entities/incident.entity';

@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'campus_incidents_db',
  entities: [Incident],
  synchronize: true,
}),
    TypeOrmModule.forFeature([Incident]),
  ],
  controllers: [IncidentsController, HealthController],
  providers: [],
})
export class AppModule {}