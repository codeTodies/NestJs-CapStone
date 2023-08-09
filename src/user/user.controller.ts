import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe,BadRequestException } from '@nestjs/common';
import { UserService} from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  @ApiBody({
  schema: {
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' }, // Thêm thuộc tính body
      email: { type: 'string'},
      password: {type: 'string'}
    },
  },
})
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return { message: 'User registered successfully', user: newUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

    @Post('signin')
  async login(@Body() loginDto:LoginDto ) {
    return this.userService.login(loginDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
