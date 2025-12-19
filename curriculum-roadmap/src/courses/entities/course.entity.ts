import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { CourseRelation } from './course-relation.entity';
@Entity('courses') // actual DB table name
export class Course { //ts entity name
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 20 })
  code: string;

//relation
  @OneToMany(() => Comment, (comment) => comment.course) //entity name . entity name
  comments: Comment[];

  @OneToMany(
    () => CourseRelation,
    (relation: CourseRelation) => relation.course, 
  )
  relations: CourseRelation[];
  
//time
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
