import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { McommentModule } from './mcomment/mcomment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    MulterModule.register({
      dest:process.cwd() + '/upload'
    }),
    ConfigModule.forRoot({isGlobal: true, envFilePath:['.env']}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(ConfigService:ConfigService) => ({
        type:'postgres',
        host:ConfigService.get("DATABASE_HOST"),
        port:ConfigService.get<number>("DATABASE_PORT"),
        username:ConfigService.get("DATABASE_USERNAME"),
        password:ConfigService.get("DATABASE_PASSWORD"),
        synchronize:ConfigService.get<boolean>("DATABASE_SYNC"),
        logging:ConfigService.get<boolean>("DATABASE_LOGGING"),
        database:ConfigService.get("DATABASE_NAME"),
        entities:[__dirname + "/**/*.entity{.ts,.js}"],
      })
    }),
    UserModule,
    McommentModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
