import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';

// 여러분이 만든 다른 모듈들 (예: AuthModule)
import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module'; 
// import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [
    // 1. .env 파일을 읽기 위한 ConfigModule 설정
    // isGlobal: true로 설정하면 다른 모듈에서도 ConfigService를 주입해 사용 가능
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeORM 모듈 설정 (비동기 방식)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 import
      inject: [ConfigService],  // ConfigService를 주입
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true, 

        synchronize: true, 
      }),
    }),
    
    // 3. 여러분의 기능 모듈들
    CoursesModule,
    AuthModule,
    // UsersModule,
    // SubjectsModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}