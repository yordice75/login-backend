import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  constructor(@InjectRepository(Auth) private readonly userRepository: Repository<Auth>, 
              private readonly jwtService: JwtService
            ){}
  
  async login(CreateAuthDto: CreateAuthDto) {
    
    const { username , password } = CreateAuthDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new BadRequestException('User not found');
    // compare password
    const isMatch = await bcrypt.compare(password , user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return {
      ...user,
      token: this.generateJwt({id: user.id })
    };
    
  }

  // create user
  async createUser(createAuthDto: CreateAuthDto) {
    
    try {
      
      const {  password, ...detailsCreateAuthDto } = createAuthDto;
      const user = this.userRepository.create({
        ...detailsCreateAuthDto,
        password: await bcrypt.hash(password, 10)
      });
      await  this.userRepository.save(user);
      return {
        ...user,
        token: this.generateJwt({id: user.id })
      };

    } catch (error) {
      
      if(error.code === '23505')  throw new  BadRequestException(`User with username '${createAuthDto.username}' already exists`);
      
      console.log(error);
      throw new BadRequestException('check logs');

    }
  }

  private generateJwt(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
