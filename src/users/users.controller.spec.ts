import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// Mocking the UsersService
jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mocking the JwtAuthGuard
      .compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const mockUser = { userId: 'mockUserId', username: 'mockUsername' };
      const mockRequest: Request = { user: mockUser } as any;

      // Mock the userService getUser method
      jest.spyOn(userService, 'getUser').mockResolvedValueOnce(mockUser);

      const result = await controller.getUserProfile(mockRequest);

      expect(result).toEqual(mockUser);
      expect(userService.getUser).toHaveBeenCalledWith(mockUser.userId);
    });
  });
});
