import { JwtModuleOptions } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET ?? 'change-this-secret',
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'],
  },
});
