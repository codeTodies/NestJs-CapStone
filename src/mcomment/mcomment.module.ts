import { Module } from '@nestjs/common';
import { McommentService } from './mcomment.service';
import { McommentController } from './mcomment.controller';

@Module({
  controllers: [McommentController],
  providers: [McommentService]
})
export class McommentModule {}
