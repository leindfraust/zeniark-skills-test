import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from './users.controller';
import { NotesService } from 'src/notes/notes.service';
import { Note, NoteSchema } from 'src/schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Note.name, schema: NoteSchema },
    ]),
  ],
  providers: [UsersService, NotesService],
  controllers: [UsersController],
})
export class UsersModule {}
