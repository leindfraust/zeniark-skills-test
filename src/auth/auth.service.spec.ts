import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

// Mocking the JwtService and UsersService
jest.mock('@nestjs/jwt');
jest.mock('src/users/users.service');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('generateJwt', () => {
    it('should generate a JWT token', async () => {
      const payload = { username: 'testUser', sub: '123' };

      // Mock the signAsync method of JwtService
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('mockToken');

      const result = await service.generateJwt(payload);

      expect(jwtService.signAsync);
      expect(result).toEqual('mockToken');
    });
  });

  describe('googleLogin', () => {
    it('should return access_token if user exists', async () => {
      const mockUser = {
        username: 'testUser',
        email: 'test@example.com',
        _id: new Types.ObjectId(),
        name: 'test',
        role: 'test',
        provider: 'test',
        providerId: 123,
      };
      jest.spyOn(userService, 'findUser').mockResolvedValueOnce(mockUser);

      const result = await service.googleLogin({ user: mockUser });

      expect(result);
      expect(service.generateJwt);
    });

    it('should create a new user and return access_token if user does not exist', async () => {
      const mockUser = {
        username: 'testUser',
        email: 'test@example.com',
        _id: new Types.ObjectId(),
        name: 'test',
        role: 'test',
        provider: 'test',
        providerId: 123,
      };
      jest.spyOn(userService, 'findUser').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(userService, 'create')
        .mockResolvedValueOnce({ ...mockUser, _id: new Types.ObjectId() });

      const result = await service.googleLogin({ user: mockUser });

      expect(result);
      expect(service.generateJwt);
    });

    it('should throw BadRequestException if user is not provided', async () => {
      await expect(service.googleLogin({})).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
