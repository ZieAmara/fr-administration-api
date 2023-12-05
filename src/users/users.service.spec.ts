import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user-table-db/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


const usersSetExpected : User[] = [
  { id: 0, lastName: 'Brou', firstName: 'John', age: 30, userName: 'john.brou', userPassword: '123456', roles: [] },
  { id: 1, lastName: 'Doe', firstName: 'Jane', age: 24, userName: 'jane.doe', userPassword: '000000', roles: [] },
  { id: 2, lastName: 'Lee', firstName: 'Alex', age: 15, userName: 'alex.lee', userPassword: 'Lee123', roles: [] },
  { id: 3, lastName: 'Sow', firstName: 'Ali', age: 51, userName: 'ali.sow', userPassword: 'Sow1&3', roles: [] },
];

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
}; 

export const repositoryMockFactory: () => MockType<Repository<User>> = jest.fn(() => ({
  create: jest.fn().mockImplementation(dto => ({ ...dto })),
  save: jest.fn().mockImplementation(user => ({ id: 0, ...user })),
  find: jest.fn().mockResolvedValue([usersSetExpected]),
  findOne: jest.fn().mockImplementation(({where:{id: userId}}) => ({id: userId, ...usersSetExpected[0]})),
}));


describe('UsersService', () => {
  let usersRepositoryMock: MockType<Repository<User>>;
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
    usersRepositoryMock = module.get('USER_REPOSITORY');

  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    
    it('should create an user', async () => {
      const createUserDto: CreateUserDto = {
        lastName: 'Brou', firstName: 'John', age: 30, userName: 'john.brou', userPassword: '123456',
      };
      const {id, userPassword, roles, ...resultExpected} = usersSetExpected[0];
      await expect(usersService.createUser(createUserDto).then(
        user => {
          createUserDto.userPassword = user.userPassword;
          const {id, userPassword, ...result} = user;
          return result;
        }
      )).resolves.toEqual(resultExpected);
      expect(usersRepositoryMock.create).toHaveBeenCalledWith(createUserDto);
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(createUserDto);
    });

    it ('The user created have a hashed password', async () => {
      const createUserDto: CreateUserDto = {
        lastName: 'Brou', firstName: 'John', age: 30, userName: 'john.brou', userPassword: '123456',
      };
      await usersService.createUser(createUserDto).then(
        user => {
          expect(bcrypt.compareSync('123456', user.userPassword)).toBe(true);
          console.log('When the creation of an user, the user password has been hashed and saved in db. \nFor this user, This hash is : ',user.userPassword);
          expect(bcrypt.compareSync('000000', user.userPassword)).toBe(false);
        }
      );
    })
    
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      await expect(usersService.getAllUsers()).resolves.toEqual([usersSetExpected]);
      expect(usersRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    const resultExpected = Promise.resolve(usersSetExpected[0]);
    it('should return an user', async () => {
      await expect(usersService.getUserById(0)).resolves.toEqual(await resultExpected);
      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({where: {id: 0}});
    });
  });

  describe('updateUser', () => {
    const resultExpected = Promise.resolve(usersSetExpected[0]);

    it('should return an user', async () => {
      jest.spyOn(usersService, 'updateUser').mockImplementation(() => resultExpected);
      expect(await usersService.updateUser(0, {lastName: 'Doe', firstName: 'John', age: 30})).toBe(await resultExpected);
    });
  });

  describe('deleteUser', () => {
    const resultExpected = Promise.resolve(true);

    it('should return true', async () => {
      jest.spyOn(usersService, 'deleteUser').mockImplementation(() => resultExpected);
      expect(await usersService.deleteUser(3)).toBe(await resultExpected);
    });
  });

});
