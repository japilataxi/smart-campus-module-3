import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { QrAccessLog } from '../qr-access/entities/qr-access-log.entity';

export const createTypeOrmOptions = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME ?? 'smart_campus',
  password: process.env.DATABASE_PASSWORD ?? 'smart_campus',
  database: process.env.DATABASE_NAME ?? 'smart_campus_qr_access',
  entities: [QrAccessLog],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
});

