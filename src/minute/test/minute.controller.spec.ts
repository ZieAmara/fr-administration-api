import { Test, TestingModule } from '@nestjs/testing';
import { MinuteController } from '../minute.controller';
import { MinuteService } from '../minute.service';
import { Minute } from '../minute-table-db/minute.entity';
import { Repository } from 'typeorm';
import { UsersModule } from '../../users/users.module';
import { AssociationsModule } from '../../associations/associations.module';
import { AssociationsService } from 'src/associations/associations.service';
import { UsersService } from 'src/users/users.service';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({}));


describe('MinuteController', () => {
  let minuteMockRepository: MockType<Repository<Minute>>;

  let minuteController: MinuteController;
  let minuteService: MinuteService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinuteController],
      providers: [
        MinuteService,
        {
          provide: 'MINUTE_REPOSITORY',
          useFactory: repositoryMockFactory,
        }
      ],
      imports: [UsersModule, AssociationsModule],
    }).compile();

    minuteController = module.get<MinuteController>(MinuteController);
    minuteService = module.get<MinuteService>(MinuteService);

    minuteMockRepository = module.get('MINUTE_REPOSITORY');
  });

  it('should be defined', () => {
    expect(minuteController).toBeDefined();
  });
});
