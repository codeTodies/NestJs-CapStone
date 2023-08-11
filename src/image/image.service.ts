import { Injectable,ConflictException, BadRequestException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { readdir,stat } from 'fs/promises';
import { join } from 'path';
import { Imate } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Imate)
    private imageRepository:Repository<Imate>
  ){}

   async createImage(createImage:CreateImageDto): Promise<Imate> {
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



  async getFileByName(fileName: string): Promise<any[]> {
    const uploadDir = join(__dirname, '../../upload');
    const filePath = join(uploadDir, fileName);

    try {
      const fileStat = await stat(filePath);
      const imageInfoList = await this.imageRepository.find({ where: { fileName } });

      const fileList = imageInfoList.map(imageInfo => ({
        fileName,
        filePath,
        fileSize: fileStat.size,
        author: imageInfo.author,
        content: imageInfo.content,
      }));

      return fileList;
    } catch (error) {
      return []; 
    }
  }

  async getAuthorByID(id:number)
  {
       try {
        const imageInfo = await this.imageRepository.findOne({ where: {id} });
       if (!imageInfo) {
        return null;
       }
       return{
         id:imageInfo.id,
         author: imageInfo.author,
         fileName: imageInfo.fileName
       }
       } catch (error) {
        return null;
       }
  }

  async getCommentByID(id: number)
  {
    try {
        const imageInfo = await this.imageRepository.findOne({ where: { id:id} });
       if (!imageInfo) {
        return null;
       }
       return{
         content:imageInfo.content
       }
       } catch (error) {
        return null;
       }
  }
  async saveImageByID(id:number)
  {
    try {
      const imageInfo = await this.imageRepository.findOne({ where: { id:id} });
     if (!imageInfo) {
        throw new BadRequestException('file not found');
       }
       else{
        imageInfo.isSave=true;
        this.imageRepository.save(imageInfo);
        return 'success'; 
       } 
    } catch (error) {
      console.log(error);
      
    }
  }

  async getImageSaved(){
    try {
    const imageInfoList = await this.imageRepository.find({ where: { isSave:true } });
    const fileList= imageInfoList.map(imageInfo=>({
        fileName: imageInfo.fileName,
        content: imageInfo.content,
    }))
    return fileList
    } catch (error) {
      return []
    }
  }
}
