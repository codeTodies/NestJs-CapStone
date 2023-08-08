import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { Express, Response } from 'express';
import { McommentService } from './mcomment.service';
import { CreateMcommentDto } from './dto/create-mcomment.dto';
import { UpdateMcommentDto } from './dto/update-mcomment.dto';
import * as path from 'path';
interface FileParams{
fileName:string;
}
@Controller('comment')
export class McommentController {
  constructor(private readonly mcommentService: McommentService) {}

  @Post()
  create(@Body() createMcommentDto: CreateMcommentDto) {
    return this.mcommentService.create(createMcommentDto);
  }


  @Get()
  findAll() {
    return this.mcommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mcommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMcommentDto: UpdateMcommentDto) {
    return this.mcommentService.update(+id, updateMcommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mcommentService.remove(+id);
  }
}
