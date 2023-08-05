import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>){}


  create(createUserDto: CreateUserDto):Promise<User> {
    const user= new User();
    user.email= createUserDto.email;
    user.password= createUserDto.password;
    user.firstName= createUserDto.firstName;
    user.lastName= createUserDto.lastName;
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({where: {email: email}});
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
