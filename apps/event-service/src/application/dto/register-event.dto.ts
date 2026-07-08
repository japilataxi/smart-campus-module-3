import { IsUUID } from 'class-validator';

export class RegisterEventDto {
  @IsUUID()
  userId!: string;
}