import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { readdir,stat } from 'fs/promises';
import { join } from 'path';
@Injectable()
export class ImageService {
  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }


  async getAllUploadedFiles(): Promise<any[]> {
    const uploadDir = join(__dirname, '../../upload');
    const files = await readdir(uploadDir);
    
    const fileInfoList = files.map((fileName) => {
      const filePath = join(uploadDir, fileName);
      return { fileName, filePath };
    });

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
