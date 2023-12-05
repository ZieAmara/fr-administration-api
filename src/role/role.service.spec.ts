import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { UsersModule } from '../users/users.module';
import { AssociationsModule } from '../associations/associations.module';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: 'ROLE_REPOSITORY',
          useValue: {},
        },
      ],
      imports: [UsersModule, AssociationsModule]
      
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
