import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Comment } from '../../courses/entities/comment.entity'; //로그인 유저 댓글

@Entity()
export class User {
  @PrimaryGeneratedColumn() // 기본 키 (Auto Increment)
  id: number;

  @Column({ unique: true }) // username 컬럼, 고유 값
  username: string;

  @Column() // password 컬럼
  @Exclude()
  password: string;

  @Column({ unique: true }) // nickname 컬럼, 고유 값
  nickname: string;

  @OneToMany(() => Comment, (comment) => comment.user) //로그인한 유저 댓글 
  comments: Comment[];
}