import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNoteDto } from 'src/dto/notes/create-note.dto';
import { UpdateNoteDto } from 'src/dto/notes/update-note.dto';
import { Note } from 'src/schemas/note.schema';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let mockNoteModel: Model<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    mockNoteModel = module.get<Model<Note>>(getModelToken(Note.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNote', () => {
    it('should create a note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'This is a test note.',
        user: 'Test',
      };
      const createdNote: Note = {
        user: 'someUserId' as any,
        title: 'Test Note',
        content: 'This is a test note.',
      };

      jest
        .spyOn(mockNoteModel, 'create')
        .mockResolvedValueOnce(createdNote as any);

      const result = await service.createNote(createNoteDto);
      expect(result).toEqual(createdNote);
    });

    it('should handle errors when creating a note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'This is a test note.',
        user: 'Test',
      };
      const errorMessage = 'Test error message';

      jest
        .spyOn(mockNoteModel, 'create')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.createNote(createNoteDto)).rejects.toThrowError(
        new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getAllNotes', () => {
    it('should get all notes for a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const notes: Note[] = [
        {
          user: userId as any,
          title: 'Note 1',
          content: 'Content 1',
        },
        {
          user: userId as any,
          title: 'Note 2',
          content: 'Content 2',
        },
      ];

      jest
        .spyOn(mockNoteModel, 'find')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(notes),
        } as any);

      const result = await service.getAllNotes(userId);
      expect(result).toEqual(notes);
    });
  });

  describe('getNote', () => {
    it('should get a specific note for a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();
      const note: Note = {
        user: userId as any,
        title: 'Test Note',
        content: 'This is a test note.',
      };

      jest
        .spyOn(mockNoteModel, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(note),
        } as any);

      const result = await service.getNote(userId, noteId);
      expect(result).toEqual(note);
    });

    it('should handle not finding a specific note for a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();

      jest
        .spyOn(mockNoteModel, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        } as any);

      await expect(service.getNote(userId, noteId)).rejects.toThrowError(
        new HttpException('Note does not exist', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateNote', () => {
    it('should update a specific note for a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'This is an updated note.',
      };

      jest
        .spyOn(mockNoteModel, 'findOneAndUpdate')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(updateNoteDto),
        } as any);

      const result = await service.updateNote(userId, noteId, updateNoteDto);
      expect(result);
    });

    it('should handle not finding a specific note for update', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        content: 'This is an updated note.',
      };

      jest
        .spyOn(mockNoteModel, 'findOneAndUpdate')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        } as any);

      await expect(
        service.updateNote(userId, noteId, updateNoteDto),
      ).rejects.toThrowError(
        new HttpException('Note does not exist', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteNote', () => {
    it('should delete a specific note for a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();
      const deletedNote: Note = {
        user: userId as any,
        title: 'Deleted Note',
        content: 'This is a deleted note.',
      };

      jest
        .spyOn(mockNoteModel, 'findOneAndDelete')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(deletedNote),
        } as any);

      const result = await service.deleteNote(userId, noteId);
      expect(result).toEqual(deletedNote);
    });

    it('should handle not finding a specific note for deletion', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const noteId: Types.ObjectId = new Types.ObjectId();

      jest
        .spyOn(mockNoteModel, 'findOneAndDelete')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        } as any);

      await expect(service.deleteNote(userId, noteId)).rejects.toThrowError(
        new HttpException('Note does not exist', HttpStatus.NOT_FOUND),
      );
    });
  });
});
