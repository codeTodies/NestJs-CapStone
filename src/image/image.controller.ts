import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { ApiBody, ApiConsumes, ApiOperation  } from '@nestjs/swagger';
import {Imate } from './entities/image.entity';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
@UseInterceptors(FileInterceptor('image', {
  storage: diskStorage({
    destination: process.cwd() + '/upload',
    filename: (req, file, callback) => {
      const name = file.originalname;
      callback(null, name);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      cb(new Error('File not match'), false);
    }
    cb(null, true);
  },
}))
@ApiConsumes('multipart/form-data')
@ApiBody({
  type: 'multipart/form-data',
  schema: {
    type: 'object',
    properties: {
      image: { type: 'string', format: 'binary' },
      authorID: { type: 'number' },
      content: { type: 'string' },
    },
    required: ['image'], 
  },
})
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body() infoImage: CreateImageDto
) {
  if (!file) {
    throw new BadRequestException('file should be an image file');
  }
  if (!infoImage) {
    throw new BadRequestException('empty value');
  } else {
    const user = await this.imageService.findUserByAuthor(infoImage.authorID);
    if (!user) {
      throw new BadRequestException('Invalid author');
    }

    // Tạo instance mới của entity
    const newImage = new Imate();
    
    // Gán giá trị từ infoImage vào entity
    newImage.content = infoImage.content;
    newImage.isSave = false;
    newImage.authorID=infoImage.authorID;
    // Gán giá trị fileName
    newImage.fileName = file.originalname;

    const savedImage = await this.imageService.createImage(newImage);
    
    // Trả về kết quả
    return {
      message: 'Upload successful',
      image: savedImage,
    };
  }
}


  @Get('getAllFiles')
  getAllFiles() {
    return this.imageService.getAllUploadedFiles();
  }


   @Get('getFile/:fileName')
    async getFile(@Param('fileName') fileName: string) {
    const fileDetails = await this.imageService.getFileByName(fileName);
    
    if (!fileDetails) {
      throw new BadRequestException('File not found');
    }
    
    return fileDetails;
  }

  @Get('getAuthorByID/:id')
  async getAuthorByID(@Param('id') id: number){
    
    const fileInfo= await this.imageService.getAuthorByID(id);
    
    if(!fileInfo)
    {
      throw new BadRequestException('File not found');
    }
    return fileInfo
  }

  @Get('getCommentByID/:id')
  async getCommentByID(@Param('id') id: number){
    const fileInfo= await this.imageService.getCommentByID(id);
    if(!fileInfo)
    {
      throw new BadRequestException('File not found');
    }
    return fileInfo
  }

  @Patch('saveCommentByID/:id')
  async saveCommentByID(@Param('id') id: number){
    return this.imageService.saveImageByID(id)
    
  }

  @Get('getSavedFile')
  async getSavedFile(){
    return this.imageService.getImageSaved()
  }

 @Delete('delete/:id')
 async deleteFile(@Param('id') id: number){
  return this.imageService.deleteData(id)
 }

 @Get('getImageByAuthorID/:id')
 async getImageByAuthorID(@Param('id') id:number){
  return this.imageService.getImagesByAuthorID(id)
 }
 
 
 @Get('getSavedImageByAuthorID/:id')
 async getSavedImageByAuthorID(@Param('id') id:number)
{
  return this.imageService.getImagesSavedByAuthorID(id)
}

}
