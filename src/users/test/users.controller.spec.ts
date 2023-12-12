import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User } from '../user-table-db/user.entity';
import { UserDto } from '../dto/user.dto';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

const users: User[] = [
  { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'john.doe', userPassword:"mdp", roles: [] },
  { id: 1, lastName: 'Lee', firstName: 'Jane', age: 50, userName: 'jane.lee', userPassword:"mdp", roles: [] },
  { id: 2, lastName: 'Sow', firstName: 'Ali', age: 16, userName: 'ali.sow', userPassword:"mdp", roles: [] },
  { id: 3, lastName: 'Smith', firstName: 'Bob', age: 35, userName: 'bob.smith', userPassword:"mdp", roles: [] }
]

const resultExpectedDto : UserDto[] = [
  { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'john.doe', roles: [] },
  { id: 1, lastName: 'Lee', firstName: 'Jane', age: 50, userName: 'jane.lee', roles: [] },
  { id: 2, lastName: 'Sow', firstName: 'Ali', age: 16, userName: 'ali.sow', roles: [] },
  { id: 3, lastName: 'Smith', firstName: 'Bob', age: 35, userName: 'bob.smith', roles: [] }
];


describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useFactory: repositoryMockFactory
        }
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should return a user', async () => {
      const resultExpected = Promise.resolve(users[0]);
      jest.spyOn(usersService, 'createUser').mockImplementation(() => resultExpected);
      expect(await usersController.createUser({lastName: 'Doe', firstName: 'John', age: 30, userName: 'john.doe', userPassword: 'password'})).toEqual(resultExpectedDto[0]);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const resultExpected = Promise.all(users);
      jest.spyOn(usersService, 'getAllUsers').mockImplementation(() => resultExpected);
      expect(await usersController.getAllUsers()).toEqual(resultExpectedDto);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const resultExpected = Promise.resolve(users[0]);
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => resultExpected);
      expect(await usersController.getUserById(0)).toEqual(resultExpectedDto[0]);
    });
  });

  describe('updateUser', () => {
    it('should return a user', async () => {
      const resultExpected = Promise.resolve(users[3]);
      jest.spyOn(usersService, 'updateUser').mockImplementation(() => resultExpected);
      expect(await usersController.updateUser(1, {lastName: 'Smith', firstName: 'Bob', age: 35, userName: 'bob.smith'})).toEqual(resultExpectedDto[3]);
    });
  });

  describe('deleteUser', () => {
    it('should return a boolean', async () => {
      const resultExpected = Promise.resolve(true);
      jest.spyOn(usersService, 'deleteUser').mockImplementation(() => resultExpected);
      expect(await usersController.deleteUser(0)).toBe(await resultExpected);
    });
  });

});
