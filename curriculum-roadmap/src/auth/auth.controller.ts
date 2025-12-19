import { Controller, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateNicknameDto, UpdatePasswordDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateAuthDto) {
    console.log('--- Controller: /auth/signup ---');
    console.log('Body로 받은 데이터:', createUserDto);

    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  login(@Body() loginData: any) {
    console.log('--- Controller: /auth/login ---');
    console.log('Body로 받은 데이터:', loginData);
    return this.authService.login(loginData);
  }
  
  // 닉네임 변경
  @UseGuards(AuthGuard('jwt'))
  @Patch('/nickname')
  async updateNickname(
    @Request() req, 
    @Body() body: UpdateNicknameDto
  ) {
    return this.authService.updateNickname(req.user, body);
  }

  // 비밀번호 변경
  @UseGuards(AuthGuard('jwt'))
  @Patch('/password')
  async updatePassword(
    @Request() req, 
    @Body() body: UpdatePasswordDto
  ) {
    return this.authService.updatePassword(req.user, body);
  }
}