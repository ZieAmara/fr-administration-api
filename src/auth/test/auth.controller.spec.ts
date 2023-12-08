import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UsersModule } from '../../users/users.module';
import { LocalAuthStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, LocalAuthStrategy, JwtStrategy],
      imports: [UsersModule, PassportModule, 
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        })
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
