import { IsInt, IsString, Length, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class RelationInput {
  @IsInt()
  related_course_id: number;

  @IsString()
  relation_type: 'prerequisite' | 'postrequisite';
}

export class CreateCommentDto {
  @IsOptional()
  @IsInt()
  user_id: number;

  @IsString()
  @Length(1, 5000)
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationInput)
  relations?: RelationInput[];
}
