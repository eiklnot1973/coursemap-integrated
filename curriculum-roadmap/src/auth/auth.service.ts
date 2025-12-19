import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateNicknameDto, UpdatePasswordDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateAuthDto): Promise<any> { // 회원가입
    const { username, password, nickname } = createUserDto;

    console.log('--- Service: signUp (암호화 진행) ---');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 유저 객체 생성
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      nickname: nickname || username,
    });

// DB 쿼리 절약 및 동시성 제어를 위해 try-catch로 저장 시도
    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      // 에러 코드로 중복 처리 (MySQL 기준: ER_DUP_ENTRY, PG 기준: 23505)
      // 사용하는 DB에 맞춰서 코드 수정
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 존재하는 아이디입니다.');
      } else {
        console.error(error);
        throw new InternalServerErrorException('회원가입 중 오류가 발생했습니다.');
      }
    }

    return {
      message: '회원가입 성공',
      user: {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
      },
    };
  }
  async login(loginData: any): Promise<{ accessToken: string; user: { username: string; nickname: string } }> { // 로그인
    const { username, password } = loginData;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        user: {
          username: user.username,
          nickname: user.nickname,
        }
       }; 
    } else {
      throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  }

// 닉네임 변경
  async updateNickname(user: User, updateNicknameDto: UpdateNicknameDto): Promise<{ message: string; nickname: string }> {
    user.nickname = updateNicknameDto.newNickname;

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      // 닉네임도 중복 에러 처리가 필요함
      if (error.code === 'ER_DUP_ENTRY') {
         throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
      throw new InternalServerErrorException();
    }

    return {
      message: '닉네임 변경 성공',
      nickname: user.nickname,
    };
  }
  
// 비밀번호 변경
  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto): Promise<void> {
     const { oldPassword, newPassword } = updatePasswordDto;

     // 현재 비밀번호 확인
     const isMatch = await bcrypt.compare(oldPassword, user.password);
     if (!isMatch) {
        throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
     }
     
     // 새 비밀번호 암호화
     const salt = await bcrypt.genSalt();
     user.password = await bcrypt.hash(newPassword, salt);
     await this.usersRepository.save(user);
  }
}