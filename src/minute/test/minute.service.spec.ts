import { Test, TestingModule } from '@nestjs/testing';
import { MinuteService } from '../minute.service';
import { Repository } from 'typeorm';
import { UsersModule } from '../../users/users.module';
import { AssociationsModule } from '../../associations/associations.module';
import { AssociationsService } from '../../associations/associations.service';
import { UsersService } from '../../users/users.service';
import { Minute } from '../minute-table-db/minute.entity';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({}));


describe('MinuteService', () => {
  let minuteMockRepository: MockType<Repository<Minute>>;

  let minuteService: MinuteService;
  let associationsService: AssociationsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinuteService,
        {
          provide: 'MINUTE_REPOSITORY',
          useFactory: repositoryMockFactory,
        }
      ],
      imports: [UsersModule, AssociationsModule],
    }).compile();

    minuteService = module.get<MinuteService>(MinuteService);
    associationsService = module.get<AssociationsService>(AssociationsService);
    usersService = module.get<UsersService>(UsersService);

    minuteMockRepository = module.get('MINUTE_REPOSITORY');

  });

  it('should be defined', () => {
    expect(minuteService).toBeDefined();
  });
});
