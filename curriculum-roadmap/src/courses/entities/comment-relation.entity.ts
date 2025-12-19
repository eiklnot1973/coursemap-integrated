import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Comment } from './comment.entity';
import { Course } from './course.entity';

@Entity('comment_relations')
export class CommentRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.relations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'related_course_id' })
  related_course: Course;

  @Column({ type: 'enum', enum: ['prerequisite', 'postrequisite'] })
  relation_type: 'prerequisite' | 'postrequisite';
}
