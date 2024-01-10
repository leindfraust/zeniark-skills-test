import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { NotesService } from 'src/notes/notes.service';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: Model<User>;
  let mockNotesService: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: NotesService,
          useValue: {
            getAllNotes: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
    mockNotesService = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        provider: 'test',
        providerId: 123,
        username: 'test',
        name: 'test',
      };
      const createdUser: User = {
        email: createUserDto.email,
        username: 'Test',
        name: 'test',
        role: 'test',
        provider: 'test',
        providerId: 123,
      };

      jest
        .spyOn(mockUserModel, 'create')
        .mockResolvedValueOnce(createdUser as any);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findUser', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const foundUser: User = {
        email: email,
        username: 'Test',
        name: 'test',
        role: 'test',
        provider: 'test',
        providerId: 123,
      };

      jest
        .spyOn(mockUserModel, 'findOne')
        .mockReturnThis()
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(foundUser),
        } as any);

      const result = await service.findUser(email);
      expect(result).toEqual(foundUser);
    });

    it('should return false if user is not found by email', async () => {
      const email = 'nonexistent@example.com';

      jest
        .spyOn(mockUserModel, 'findOne')
        .mockReturnThis()
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(null),
        } as any);

      const result = await service.findUser(email);
      expect(result).toBe(false);
    });
  });

  describe('getUser', () => {
    it('should get user details along with notes', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();
      const getUser: User = {
        email: 'test@example.com',
        username: 'Test',
        name: 'test',
        role: 'test',
        provider: 'test',
        providerId: 123,
      };
      const getAllNotes = [
        {
          _id: new Types.ObjectId(),
          user: userId,
          title: 'Note 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: new Types.ObjectId(),
          user: userId,
          title: 'Note 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest
        .spyOn(mockUserModel, 'findById')
        .mockReturnThis()
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(getUser),
        } as any);

      jest
        .spyOn(mockNotesService, 'getAllNotes')
        .mockReturnThis()
        .mockResolvedValueOnce(getAllNotes as any);

      const result = await service.getUser(userId);
      expect(result).toEqual({
        user: getUser,
        notes: getAllNotes,
      });
    });

    it('should handle not finding a user', async () => {
      const userId: Types.ObjectId = new Types.ObjectId();

      jest
        .spyOn(mockUserModel, 'findById')
        .mockReturnThis()
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(null),
        } as any);

      await expect(service.getUser(userId)).rejects.toThrowError(
        new HttpException('User not found.', HttpStatus.NOT_FOUND),
      );
    });
  });
});
