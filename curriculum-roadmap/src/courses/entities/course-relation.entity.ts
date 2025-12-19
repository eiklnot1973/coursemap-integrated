import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('course_relations')
export class CourseRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.relations)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'related_course_id' })
  related_course: Course;

  @Column({
    type: 'enum',
    enum: ['prerequisite', 'postrequisite'],
  })
  relation_type: 'prerequisite' | 'postrequisite';

  @Column({ default: 0 })
  counts: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
