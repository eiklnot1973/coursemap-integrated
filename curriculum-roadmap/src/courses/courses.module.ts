import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Comment } from './entities/comment.entity';
import { CourseRelation } from './entities/course-relation.entity';
import { CommentRelation } from './entities/comment-relation.entity';
import { User } from '../auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Comment, CourseRelation, CommentRelation, User])], 
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
