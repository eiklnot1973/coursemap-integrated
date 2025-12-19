import { IsInt, IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class RelationInput {
  @IsInt()
  related_course_id: number;

  @IsString()
  relation_type: 'prerequisite' | 'postrequisite';
}

export class UpdateCommentDto {
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationInput)
  relations?: RelationInput[];
}
