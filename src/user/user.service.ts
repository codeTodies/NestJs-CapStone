import { Injectable, UnauthorizedException,ConflictException,NotFoundException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { IsEmail,validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

 async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where:{email} });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email: email } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async login(loginDto: LoginDto) {
    const isValid = await this.validateUser(loginDto);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  const { email,password } = loginDto;
  const existingUser = await this.userRepository.findOne({ where: { email } });
   if(!existingUser|| existingUser.password!==password)
   {
        throw new NotFoundException('please check email or password');
   }
   else
   {
    return 'login success'
   }
  }

  async validateUser(loginDto: LoginDto): Promise<boolean> {
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      return false;
    }
    else
    {
      return true;
    }
  }
}

