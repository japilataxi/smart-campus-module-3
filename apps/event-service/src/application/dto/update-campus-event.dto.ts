import { PartialType } from '@nestjs/mapped-types';
import { CreateCampusEventDto } from './create-campus-event.dto';

export class UpdateCampusEventDto extends PartialType(CreateCampusEventDto) {}