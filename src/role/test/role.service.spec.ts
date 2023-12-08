import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from '../role.service';
import { UsersModule } from '../../users/users.module';
import { AssociationsModule } from '../../associations/associations.module';
import { Repository } from 'typeorm';
import { Role } from '../role-table-db/role.entity';
import { UsersService } from '../../users/users.service';
import { AssociationsService } from '../../associations/associations.service';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<Role>> = jest.fn(() => ({}));


describe('RoleService', () => {
  let roleService: RoleService;
  let usersService: UsersService;
  let associationsService: AssociationsService;

  let roleRepositoryMock: MockType<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: 'ROLE_REPOSITORY',
          useFactory: repositoryMockFactory,
        },
      ],
      imports: [UsersModule, AssociationsModule]
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    usersService = module.get<UsersService>(UsersService);
    associationsService = module.get<AssociationsService>(AssociationsService);

    roleRepositoryMock = module.get('ROLE_REPOSITORY');
    
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });
});
