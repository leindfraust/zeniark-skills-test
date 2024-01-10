import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from 'src/dto/notes/create-note.dto';
import { UpdateNoteDto } from 'src/dto/notes/update-note.dto';

const mockNotesService = {
  getAllNotes: jest.fn(),
  getNote: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
};

describe('NotesController', () => {
  let controller: NotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllNotes', () => {
    it('should get all notes for the authenticated user', async () => {
      const userId = 'user123';
      const req = { user: { userId } };

      mockNotesService.getAllNotes.mockResolvedValueOnce([]);

      const result = await controller.getAllNotes(req);

      expect(mockNotesService.getAllNotes).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });
  });

  describe('getNote', () => {
    it('should get a specific note for the authenticated user', async () => {
      const userId = 'user123';
      const noteId = 'note456';
      const req = { user: { userId } };

      mockNotesService.getNote.mockResolvedValueOnce({});

      const result = await controller.getNote(req, { id: noteId });

      expect(mockNotesService.getNote).toHaveBeenCalledWith(userId, noteId);
      expect(result).toEqual({});
    });
  });

  describe('createNote', () => {
    it('should create a new note for the authenticated user', async () => {
      const userId = 'user123';
      const req = { user: { userId } };
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test Content',
        user: 'Test User',
      };

      mockNotesService.createNote.mockResolvedValueOnce({});

      const result = await controller.createNote(req, createNoteDto);

      expect(mockNotesService.createNote).toHaveBeenCalledWith({
        ...createNoteDto,
        user: userId,
      });
      expect(result).toEqual({});
    });
  });

  describe('updateNote', () => {
    it('should update a specific note for the authenticated user', async () => {
      const userId = 'user123';
      const noteId = 'note456';
      const req = { user: { userId } };
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      mockNotesService.updateNote.mockResolvedValueOnce({});

      const result = await controller.updateNote(
        req,
        { id: noteId },
        updateNoteDto,
      );

      expect(mockNotesService.updateNote).toHaveBeenCalledWith(
        userId,
        noteId,
        updateNoteDto,
      );
      expect(result).toEqual({});
    });
  });

  describe('deleteNote', () => {
    it('should delete a specific note for the authenticated user', async () => {
      const userId = 'user123';
      const noteId = 'note456';
      const req = { user: { userId } };

      mockNotesService.deleteNote.mockResolvedValueOnce({});

      const result = await controller.deleteNote(req, { id: noteId });

      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(userId, noteId);
      expect(result).toEqual({});
    });
  });
});
