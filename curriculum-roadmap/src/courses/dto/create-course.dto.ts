import { IsString, Length, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString() @Length(1, 50)
  name: string;

  @IsString() @Length(1, 20)
  code: string;

  @IsOptional() @IsString()
  description?: string;
}
