import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imate } from './entities/image.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Imate])],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule {}
