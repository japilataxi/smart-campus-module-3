import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  getDefaultRoleName(): string {
    return 'student';
  }
}