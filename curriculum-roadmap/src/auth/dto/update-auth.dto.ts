import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_ERROR_MSG, MAX_PASSWORD_ERROR_MSG, MAX_PASSWORD_LEN, MIN_PASSWORD_ERROR_MSG, MIN_PASSWORD_LEN } from '../auth.constants';


// 닉네임 변경용 DTO
export class UpdateNicknameDto {
    @IsString()
    @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
    @MaxLength(10, { message: '닉네임은 최대 10자까지 가능합니다.' })
    newNickname: string;
}

// 비밀번호 변경용 DTO
export class UpdatePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(MIN_PASSWORD_LEN, { message: MIN_PASSWORD_ERROR_MSG })
    @MaxLength(MAX_PASSWORD_LEN, { message: MAX_PASSWORD_ERROR_MSG })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MSG })
    newPassword: string;
}