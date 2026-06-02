import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserRole } from '../domain/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;

  const userRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(userRepository as any, jwtService as any);
  });

  it('should register a new user', async () => {
    userRepository.findOne.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    userRepository.create.mockReturnValue({
      name: 'Admin Library',
      email: 'admin@uce.edu.ec',
      password: 'hashed-password',
      role: UserRole.ADMIN,
    });

    userRepository.save.mockResolvedValue({
      id: 'user-001',
      name: 'Admin Library',
      email: 'admin@uce.edu.ec',
      password: 'hashed-password',
      role: UserRole.ADMIN,
    });

    const result = await authService.register({
      name: 'Admin Library',
      email: 'admin@uce.edu.ec',
      password: '123456',
      role: UserRole.ADMIN,
    });

    expect(result).toEqual({
      id: 'user-001',
      name: 'Admin Library',
      email: 'admin@uce.edu.ec',
      role: UserRole.ADMIN,
    });
  });

  it('should throw ConflictException when email already exists', async () => {
    userRepository.findOne.mockResolvedValue({
      email: 'admin@uce.edu.ec',
    });

    await expect(
      authService.register({
        name: 'Admin Library',
        email: 'admin@uce.edu.ec',
        password: '123456',
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should login successfully', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 'user-001',
      name: 'Admin Library',
      email: 'admin@uce.edu.ec',
      password: 'hashed-password',
      role: UserRole.ADMIN,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('jwt-token');

    const result = await authService.login({
      email: 'admin@uce.edu.ec',
      password: '123456',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(result.user.role).toBe(UserRole.ADMIN);
  });

  it('should throw UnauthorizedException with invalid email', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'wrong@uce.edu.ec',
        password: '123456',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});