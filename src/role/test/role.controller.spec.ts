import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';
import { UsersModule } from '../../users/users.module';
import { AssociationsModule } from '../../associations/associations.module';
import { RoleDTOMapping } from '../dto/role.dto.mapping';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: 'ROLE_REPOSITORY',
          useValue: {},
        },
        RoleDTOMapping,
      ],
      imports: [UsersModule, AssociationsModule]
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
