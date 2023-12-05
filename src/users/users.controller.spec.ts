import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user-table-db/user.entity';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

const usersSetExpected : User[] = [
  { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'johndoe', userPassword: 'password' },
  { id: 1, lastName: 'Doe', firstName: 'Jane', age: 30, userName: 'janedoe', userPassword: 'password' },
  { id: 2, lastName: 'Doe', firstName: 'John', age: 30, userName: 'johndoe', userPassword: 'password' },
  { id: 3, lastName: 'Doe', firstName: 'Jane', age: 30, userName: 'janedoe', userPassword: 'password' },
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
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30,
        userName: 'john.doe',
        userPassword: 'password'
      });
      jest.spyOn(usersService, 'createUser').mockImplementation(() => resultExpected);
      expect(await usersController.createUser({lastName: 'Doe', firstName: 'John', age: 30, userName: 'john.doe', userPassword: 'password'})).toBe(await resultExpected);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const resultExpected = Promise.all([{
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30,
        userName: 'john.doe',
        userPassword: 'password'
      }]);
      jest.spyOn(usersService, 'getAllUsers').mockImplementation(() => resultExpected);
      expect(await usersController.getAllUsers()).toBe(await resultExpected);
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30,
        userName: 'john.doe',
        userPassword: 'password'
      });
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => resultExpected);
      expect(await usersController.getUserById(0)).toBe(await resultExpected);
    });
  });

  describe('updateUser', () => {
    it('should return a user', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30,
        userName: 'john.doe',
        userPassword: 'password'
      });
      jest.spyOn(usersService, 'updateUser').mockImplementation(() => resultExpected);
      expect(await usersController.updateUser(0, {lastName: 'Doe', firstName: 'John', age: 30})).toBe(await resultExpected);
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
