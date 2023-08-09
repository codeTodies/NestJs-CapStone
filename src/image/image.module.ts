import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imafe } from './entities/image.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Imafe])],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule {}
