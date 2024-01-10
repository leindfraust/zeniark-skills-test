import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { Request } from '@nestjs/common';

// Mocking the AuthService
jest.mock('./auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideGuard(GoogleOAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // Mocking the GoogleOAuthGuard
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('googleAuthRedirect', () => {
    it('should call googleLogin method of AuthService with the request', () => {
      const mockRequest: Request = { user: {} } as any;

      // Mock the googleLogin method of AuthService
      jest.spyOn(authService, 'googleLogin').mockResolvedValueOnce({
        access_token: 'mockToken',
      });

      controller.googleAuthRedirect(mockRequest);

      expect(authService.googleLogin).toHaveBeenCalledWith(mockRequest);
    });
  });
});
