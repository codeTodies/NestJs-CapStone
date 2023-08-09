import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiBody, ApiConsumes, ApiOperation  } from '@nestjs/swagger';
import { Imafe } from './entities/image.entity';

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
      author: { type: 'string' },
      info: { type: 'string' },
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
    // Tạo instance mới của entity
    const newImage = new Imafe();
    
    // Gán giá trị từ infoImage vào entity
    newImage.author = infoImage.author;
    newImage.info = infoImage.info;
    
    // Gán giá trị fileName
    newImage.fileName = file.originalname;

    // Lưu entity vào cơ sở dữ liệu
    const savedImage = await this.imageService.createImage(newImage);
    
    // Trả về kết quả
    return {
      message: 'Upload successful',
      fileName: file.originalname,
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
    const fileDetails = await this.imageService.getFileDetails(fileName);
    
    if (!fileDetails) {
      throw new BadRequestException('File not found');
    }
    
    return fileDetails;
  }
}
