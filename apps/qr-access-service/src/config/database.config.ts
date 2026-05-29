export const databaseConfig = () => ({
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USERNAME ?? 'smart_campus',
    password: process.env.DATABASE_PASSWORD ?? 'smart_campus',
    name: process.env.DATABASE_NAME ?? 'smart_campus_qr_access',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  },
});

