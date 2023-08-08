import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Response } from 'express';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiBody, ApiConsumes, ApiOperation  } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Uploads a file' })
  @ApiBody({
    type: 'file', 
    schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file should be image file');
    } else {
      return 'success';
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
