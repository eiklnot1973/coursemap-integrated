import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ID_REGEX, ID_ERROR_MSG, PASSWORD_REGEX, PASSWORD_ERROR_MSG, MAX_PASSWORD_ERROR_MSG, MAX_PASSWORD_LEN, MIN_PASSWORD_ERROR_MSG, MIN_PASSWORD_LEN } from '../auth.constants';


export class CreateAuthDto {
    @IsString()
    @MinLength(5, { message: '아이디는 최소 5자 이상이어야 합니다.' })
    @MaxLength(20, { message: '아이디는 최대 20자까지 가능합니다.' })
    @Matches(ID_REGEX, { message: ID_ERROR_MSG })
    username: string;

    @IsString()
    @MinLength(MIN_PASSWORD_LEN, { message: MIN_PASSWORD_ERROR_MSG })
    @MaxLength(MAX_PASSWORD_LEN, { message: MAX_PASSWORD_ERROR_MSG })
    @Matches(PASSWORD_REGEX, { message: PASSWORD_ERROR_MSG })
    password: string;

    @IsString()
    @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
    @MaxLength(10, { message: '닉네임은 최대 10자까지 가능합니다.' })
    nickname: string;   
}

