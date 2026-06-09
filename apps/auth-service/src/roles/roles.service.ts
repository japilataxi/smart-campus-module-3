import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleEnum } from '../auth/enums/role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  async ensureDefaultRoles(): Promise<void> {
    const defaultRoles = [
      RoleEnum.STUDENT,
      RoleEnum.LIBRARIAN,
      RoleEnum.ADMIN,
    ];

    for (const roleName of defaultRoles) {
      const exists = await this.rolesRepository.findOne({
        where: { name: roleName },
      });

      if (!exists) {
        const role = this.rolesRepository.create({
          name: roleName,
          permissions: [],
        });

        await this.rolesRepository.save(role);
      }
    }
  }

  async findByNames(names: string[]): Promise<Role[]> {
    await this.ensureDefaultRoles();

    return this.rolesRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  getDefaultRoleName(): string {
    return RoleEnum.STUDENT;
  }
}