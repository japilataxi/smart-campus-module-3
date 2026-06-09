import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase());

    const defaultRole = adminEmails.includes(data.email.toLowerCase())
      ? RoleEnum.ADMIN
      : RoleEnum.STUDENT;

    const roles = await this.rolesService.findByNames([defaultRole]);

    const user = this.usersRepository.create({
      ...data,
      roles,
    });

    return this.usersRepository.save(user);
  }

  async updateRoles(userId: string, roleNames: RoleEnum[]): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.rolesService.findByNames(roleNames);

    user.roles = roles;

    return this.usersRepository.save(user);
  }
}