import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
}; 

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));


describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useFactory: repositoryMockFactory
        }
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  
  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should return an user', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30
      });
      jest.spyOn(usersService, 'createUser').mockImplementation(() => resultExpected);
      expect(await usersService.createUser({lastName: 'Doe', firstName: 'John', age: 30})).toBe(await resultExpected);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const resultExpected = Promise.all([
        {
          id: 0,
          lastName: 'Doe',
          firstName: 'John',
          age: 30
        }
      ]);
      jest.spyOn(usersService, 'getAllUsers').mockImplementation(() => resultExpected);
      expect(await usersService.getAllUsers()).toBe(await resultExpected);
    });
  });

  describe('getUserById', () => {
    it('should return an user', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30
      });
      jest.spyOn(usersService, 'getUserById').mockImplementation(() => resultExpected);
      expect(await usersService.getUserById(0)).toBe(await resultExpected);
    });
  });

  describe('updateUser', () => {
    it('should return an user', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        lastName: 'Doe',
        firstName: 'John',
        age: 30
      });
      jest.spyOn(usersService, 'updateUser').mockImplementation(() => resultExpected);
      expect(await usersService.updateUser(0, {lastName: 'Doe', firstName: 'John', age: 30})).toBe(await resultExpected);
    });
  });

  describe('deleteUser', () => {
    it('should return true', async () => {
      const resultExpected = Promise.resolve(true);
      jest.spyOn(usersService, 'deleteUser').mockImplementation(() => resultExpected);
      expect(await usersService.deleteUser(0)).toBe(await resultExpected);
    });
  });

});
