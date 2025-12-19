import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Comment } from './entities/comment.entity';
import { CourseRelation } from './entities/course-relation.entity';
import { User } from '../auth/entities/auth.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateRelationDto } from './dto/create-relation.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courses: Repository<Course>,
    @InjectRepository(Comment) private comments: Repository<Comment>,
    @InjectRepository(CourseRelation) private relations: Repository<CourseRelation>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async createCourse(dto: CreateCourseDto) {
    const course = this.courses.create(dto); //creating insert entity
    return this.courses.save(course); //save -> SQL INSERT
  }

  findAll() {
    return this.courses.find({ relations: ['relations'] });
  }

  async findOne(id: number) {
    const course = await this.courses.findOne({
      where: { id },
      // relations: ['comments', 'comments.user'] 로 하면 유저 정보까지 가져옵니다.
      relations: ['relations', 'comments', 'comments.user', 'comments.relations', 'comments.relations.related_course'],
      order: {
          comments: { created_at: 'DESC' } // 댓글 최신순 정렬
      }
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async addRelation(courseId: number, dto: CreateRelationDto) {
    const course = await this.findOne(courseId);
    const related = await this.courses.findOne({ where: { id: dto.related_course_id } });
    if (!related) throw new NotFoundException('Related course not found');

    const existing = await this.relations.findOne({ //이미 생성된 관계인지 검사
      where: {
        course: { id: course.id },
        related_course: { id: related.id },
        relation_type: dto.relation_type,
      },
      relations: ['course', 'related_course'],
    });
    
    if (existing) { //이미 생성된 관계면 count증가
      existing.counts +=1;
      return this.relations.save(existing);
    }

    const relation = this.relations.create({ //처음 등록시 count =1
      course, 
      related_course: related,
      relation_type: dto.relation_type,
      counts: 1,
    });
    return this.relations.save(relation);
  }

  async removeRelation(
    courseId: number,
    relatedCourseId: number,
    relationType: 'prerequisite' | 'postrequisite',
  ) {
    const relation = await this.relations.findOne({
      where: {
        course: { id: courseId },
        related_course: { id: relatedCourseId },
        relation_type: relationType,
      },
      relations: ['course', 'related_course'],
    });

    if (!relation) return null; // 존재 안 하면 무시

    if (relation.counts > 1) {
      relation.counts -= 1;
      return this.relations.save(relation); // UPDATE 실행
    } else {
      return this.relations.remove(relation); // DELETE 실행
    }
  }


async addComment(courseId: number, dto: CreateCommentDto) {
  const course = await this.findOne(courseId);

  const comment = this.comments.create({
      course,
      user: { id: dto.user_id } as User, // user 객체 형태로 할당
      content: dto.content,
    });

  // 여러 관계가 포함된 경우
  if (dto.relations && dto.relations.length > 0) {
    comment.relations = [];

    for (const rel of dto.relations) {
      const related = await this.courses.findOne({ where: { id: rel.related_course_id } });
      if (!related) throw new NotFoundException(`Course ${rel.related_course_id} not found`);

      // 관계 count 관리용 (course_relations 테이블)
      await this.addRelation(course.id, {
        related_course_id: related.id,
        relation_type: rel.relation_type,
      });

      // 댓글 자체 관계 저장용 (comment_relations 테이블)
      comment.relations.push({
        related_course: related,
        relation_type: rel.relation_type,
      } as any);
    }
  }

  return this.comments.save(comment);
}


async updateComment(commentId: number, dto: UpdateCommentDto) {
  const comment = await this.comments.findOne({
    where: { id: commentId },
    relations: ['course', 'user', 'relations', 'relations.related_course'],
  });
  if (!comment) throw new NotFoundException('Comment not found');

  // 작성자 검증
  if (dto.user_id !== comment.user.id) {
    throw new ForbiddenException('자신의 댓글만 수정할 수 있습니다.');
  }

  // 내용 수정
  if (dto.content) comment.content = dto.content;

  // === 기존 관계 해제 ===
  if (comment.relations && comment.relations.length > 0) {
    for (const rel of comment.relations) {
      // CourseRelation 테이블 count 감소
      await this.removeRelation(
        comment.course.id,
        rel.related_course.id,
        rel.relation_type,
      );
    }
    // CommentRelation 테이블에서 제거
    comment.relations = [];
  }

  // === 새 관계 추가 ===
  if (dto.relations && dto.relations.length > 0) {
    comment.relations = [];

    for (const rel of dto.relations) {
      const related = await this.courses.findOne({
        where: { id: rel.related_course_id },
      });
      if (!related) throw new NotFoundException(`Course ${rel.related_course_id} not found`);

      await this.addRelation(comment.course.id, {
        related_course_id: related.id,
        relation_type: rel.relation_type,
      });

      comment.relations.push({
        related_course: related,
        relation_type: rel.relation_type,
      } as any);
    }
  }

  // === 저장 ===
  return this.comments.save(comment);
}


// 댓글 삭제 (counts 감소 포함)
async deleteComment(commentId: number, user_id: number) {
  const comment = await this.comments.findOne({
    where: { id: commentId },
    relations: ['course', 'user', 'relations', 'relations.related_course'],
  });
  if (!comment) throw new NotFoundException('Comment not found');

  // 작성자 검증
  if (comment.user.id !== user_id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

  // === 연결된 모든 관계에 대해 counts 감소 ===
  if (comment.relations && comment.relations.length > 0) {
    for (const rel of comment.relations) {
      const relation = await this.relations.findOne({
        where: {
          course: { id: comment.course.id },
          related_course: { id: rel.related_course.id },
          relation_type: rel.relation_type,
        },
        relations: ['course', 'related_course'],
      });

      if (relation) {
        if (relation.counts > 1) {
          relation.counts -= 1;
          await this.relations.save(relation);
        } else {
          await this.relations.remove(relation);
        }
      }
    }
  }

  // === 댓글 자체 삭제 ===
  await this.comments.remove(comment);

  return { message: 'Comment and related relations deleted successfully' };
}

// 로그인한 사용자 댓글 조회
async findCommentsByUser(userId: number) {
  return this.comments.find({
    where: { user: { id: userId } },
    relations: [
      'course',
      'relations',
      'relations.related_course',
    ], 
    order: { created_at: 'DESC' },
  });
}

}
