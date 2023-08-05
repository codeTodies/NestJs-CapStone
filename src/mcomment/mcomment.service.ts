import { Injectable } from '@nestjs/common';
import { CreateMcommentDto } from './dto/create-mcomment.dto';
import { UpdateMcommentDto } from './dto/update-mcomment.dto';

@Injectable()
export class McommentService {
  create(createMcommentDto: CreateMcommentDto) {
    return 'This action adds a new mcomment';
  }

  findAll() {
    return `This action returns all mcomment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mcomment`;
  }

  update(id: number, updateMcommentDto: UpdateMcommentDto) {
    return `This action updates a #${id} mcomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} mcomment`;
  }
}
