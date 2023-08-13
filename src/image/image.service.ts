import { Injectable,ConflictException, BadRequestException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { readdir,stat } from 'fs/promises';
import { join } from 'path';
import { Imate } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Imate)
    private imageRepository:Repository<Imate>,
     @InjectRepository(User)
    public userRepository: Repository<User>,
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
    const imageInfo = await this.imageRepository.find({ where: { fileName },relations:['authorID'] });
    return { fileName, filePath, imageInfo };
  }));
  return fileInfoList;
}

  async getFileByName(fileName: string): Promise<any[]> {
    const uploadDir = join(__dirname, '../../upload');
    const filePath = join(uploadDir, fileName);

    try {
      const fileStat = await stat(filePath);
      const imageInfoList = await this.imageRepository.find({ where: { fileName },relations:['authorID'] });

      const fileList = imageInfoList.map(imageInfo => ({
        fileName,
        filePath,
        fileSize: fileStat.size,
        author: imageInfo.authorID,
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
        const imageInfo = await this.imageRepository.findOne({ where: { id},relations:['authorID'] });
        
       if (!imageInfo) {
        return null;
       }
       return{
         authorID: imageInfo.authorID,
         fileName: imageInfo.fileName
       }
       } catch (error) {
        return null;
       }
  }

  async getCommentByID(id: number)
  {
    try {
        const imageInfo = await this.imageRepository.findOne({ where: { id},relations:['authorID'] });
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
        id:imageInfo.id
    }))
    return fileList
    } catch (error) {
      return []
    }
  }
   async findUserByAuthor(author: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: author } });
  }

 async getImagesByAuthorID(authorID: number): Promise<any[]> {
 const imagesByUserId = await this.imageRepository.createQueryBuilder('image')
  .leftJoinAndSelect('image.authorID', 'author')
  .where('author.id = :id', { id: authorID })
  .select(['image.fileName','image.id', 'image.content', 'author.email', 'author.id'])
  .getMany();
  
  const fileList = imagesByUserId.map(imageInfo => ({
    author: imageInfo.authorID, // Sử dụng thông tin từ mối quan hệ đã load
    content: imageInfo.content,
    idImage:imageInfo.id,
    fileName: imageInfo.fileName
  }));

  return fileList;
}

 async getImagesSavedByAuthorID(authorID: number): Promise<any[]> {
 const imagesByUserId = await this.imageRepository.createQueryBuilder('image')
  .leftJoinAndSelect('image.authorID', 'author')
  .where('author.id = :id', { id: authorID })
  .andWhere('image.isSave = :isSave', { isSave: true })
  .select(['image.fileName', 'image.id', 'image.content', 'author.email', 'author.id'])
  .getMany();
  
  const fileList = imagesByUserId.map(imageInfo => ({
    author: imageInfo.authorID, // Sử dụng thông tin từ mối quan hệ đã load
    content: imageInfo.content,
    idImage:imageInfo.id,
    fileName: imageInfo.fileName
  }));

  return fileList;
}

 async deleteData(id: number) {

  const imageToDelete = await this.imageRepository.findOne({where:{id:id}});
  if (!imageToDelete) {
    throw new BadRequestException(`file not found`);
  }

  await this.imageRepository.delete(id);
}
}
