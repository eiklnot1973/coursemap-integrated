import { Controller, Get, Param, Post, Body, Delete, Patch, ParseIntPipe, Query, UseGuards, Request, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateRelationDto } from './dto/create-relation.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';



@Controller('courses') 
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()// 모든 교과목, 과목명 + 선이수 후이수 관계
  getCourses() { 
    return this.service.findAll();
  }

  //로그인 유저 작성댓글 반환: @Get id보다 위에 있어야함 /courses 
  @UseGuards(AuthGuard('jwt'))
  @Get('my-comments')
  async getMyComments(@Req() req) {
    const userId = req.user.id;
    return this.service.findCommentsByUser(userId);
  }

  @Get(':id') //특정 id 과목 모든 정보
  getCourse(@Param('id', ParseIntPipe) id: number) { //ParseIntPipe : extract id from url and transform into int
    return this.service.findOne(id); 
  }

  @Post() // 새 교과목 추가
  createCourse(@Body() dto: CreateCourseDto) {
    return this.service.createCourse(dto);
  }

  @Post(':id/relations') //관계 추가 (선이수, 후이수)
  addRelation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRelationDto,
  ) {
    return this.service.addRelation(id, dto);
  }

  @UseGuards(AuthGuard('jwt')) // (토큰 없으면 401 에러)
  @Post(':id/comments')
  addComment(
    @Request() req, // 요청 객체에서 토큰 정보 꺼내기
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
  ) {
    // 토큰에서 꺼낸 진짜 user_id를 DTO에 덮어씌움
    dto.user_id = req.user.id; 
    
    return this.service.addComment(id, dto);
  }

  // 댓글 수정 (본인만 가능)
  @UseGuards(AuthGuard('jwt'))
  @Patch('comments/:id')
  updateComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    // 본인 확인을 위해 토큰의 user_id를 넘겨줌
    dto.user_id = req.user.id;
    return this.service.updateComment(id, dto);
  }

  //댓글 삭제 (본인만 가능 + 관계 count 감소)
  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:id')
  deleteComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // 서비스의 deleteComment(commentId, userId) 호출
    return this.service.deleteComment(id, req.user.id);
  }


}
