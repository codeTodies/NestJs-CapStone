import { Injectable,ConflictException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { readdir,stat } from 'fs/promises';
import { join } from 'path';
import { Imafe } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Imacdfe)
    private imageRepository:Repository<Imafe>
  ){}

   async createImage(createImage:CreateImageDto): Promise<Imafe> {
    const image = this.imageRepository.create(createImage);
    return this.imageRepository.save(image);
  }
 async getAllUploadedFiles(): Promise<any[]> {
  const uploadDir = join(__dirname, '../../upload');
  const files = await readdir(uploadDir);

  const fileInfoList = await Promise.all(files.map(async (fileName) => {
    const filePath = join(uploadDir, fileName);
    const imageInfo = await this.imageRepository.findOne({ where: { fileName } });
    return { fileName, filePath, imageInfo };
  }));

  return fileInfoList;
}



  async getFileDetails(fileName: string): Promise<any | null> {
    const filePath = join(__dirname, '../../upload', fileName);
    
    try {
      const fileStat = await stat(filePath);
      return {
        fileName,
        filePath,
        fileSize: fileStat.size,
      };
    } catch (error) {
      return null; // Trả về null nếu tệp không tồn tại
    }
  }
}
