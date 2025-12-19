import { IsIn, IsInt } from 'class-validator';

export class CreateRelationDto {
  @IsInt()
  related_course_id: number;

  @IsIn(['prerequisite', 'postrequisite'])
  relation_type: 'prerequisite' | 'postrequisite';
}
