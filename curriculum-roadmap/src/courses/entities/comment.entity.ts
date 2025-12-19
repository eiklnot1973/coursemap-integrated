import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Course } from './course.entity';
import { CommentRelation } from './comment-relation.entity';
import { User } from '../../auth/entities/auth.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.comments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true }) // 유저 삭제되면 댓글도 삭제
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  // 선/후이수 타입
  @OneToMany(() => CommentRelation, (rel) => rel.comment, { cascade: true })
  relations: CommentRelation[];
}
