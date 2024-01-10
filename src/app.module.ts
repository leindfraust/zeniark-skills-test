import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NotesModule,
    MongooseModule.forRoot(String(process.env.MONGODB_SECRET)),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
