import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNoteDto } from 'src/dto/notes/create-note.dto';
import { UpdateNoteDto } from 'src/dto/notes/update-note.dto';
import { Note } from 'src/schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    try {
      const createNote = await this.noteModel.create(createNoteDto);
      return createNote;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllNotes(userId: Types.ObjectId): Promise<Note[]> {
    const getNotes = await this.noteModel
      .find({
        user: userId,
      })
      .exec();
    return getNotes;
  }

  async getNote(userId: Types.ObjectId, objId: Types.ObjectId): Promise<Note> {
    const getNotes = await this.noteModel
      .findOne({
        user: userId,
        _id: objId,
      })
      .exec();
    if (getNotes) return getNotes;
    throw new HttpException('Note does not exist', HttpStatus.NOT_FOUND);
  }

  async updateNote(
    userId: Types.ObjectId,
    objId: Types.ObjectId,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const updateNote = await this.noteModel
      .findOneAndUpdate(
        {
          user: userId,
          _id: objId,
        },
        updateNoteDto,
        { returnDocument: 'after' },
      )
      .exec();
    if (updateNote) return updateNote;
    throw new HttpException('Note does not exist', HttpStatus.NOT_FOUND);
  }

  async deleteNote(
    userId: Types.ObjectId,
    objId: Types.ObjectId,
  ): Promise<Note> {
    const updateNote = await this.noteModel
      .findOneAndDelete({
        user: userId,
        _id: objId,
      })
      .exec();
    if (updateNote) return updateNote;
    throw new HttpException('Note does not exist', HttpStatus.NOT_FOUND);
  }
}
