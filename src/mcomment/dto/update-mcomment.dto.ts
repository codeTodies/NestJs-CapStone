import { PartialType } from '@nestjs/mapped-types';
import { CreateMcommentDto } from './create-mcomment.dto';

export class UpdateMcommentDto extends PartialType(CreateMcommentDto) {}
