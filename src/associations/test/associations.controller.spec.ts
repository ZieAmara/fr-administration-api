import { Test, TestingModule } from '@nestjs/testing';
import { AssociationsController } from '../associations.controller';
import { AssociationsService } from '../associations.service';
import { Repository } from 'typeorm';
import { UsersModule } from '../../users/users.module';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

describe('AssociationsController', () => {
  let associationController: AssociationsController;
  let associationService: AssociationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociationsController],
      providers: [
        AssociationsService,
        {
          provide: 'ASSOCIATIONS_REPOSITORY',
          useFactory: repositoryMockFactory
        },
      ],
      imports: [UsersModule],
    }).compile();

    associationController = module.get<AssociationsController>(AssociationsController);
    associationService = module.get<AssociationsService>(AssociationsService);
  });


  it('should be defined', () => {
    expect(associationController).toBeDefined();
  });

  describe('createAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28, userName: 'jane.doe', userPassword: 'password', roles: [] },
          { id: 3, firstName: 'Bob', lastName: 'Smith', age: 35, userName: 'bob.smith', userPassword: 'password', roles: [] }
        ],
        name: 'Association test', 
        roles: [],
        minutes: []
      });
      jest.spyOn(associationService, 'createAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.createAssociation({idUsers: [1, 2, 3], name: 'Association test'})).toBe(await resultExpected);
    });
  });

  describe('getAllAssociations', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all([{
        id: 0,
        Users: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28, userName: 'jane.doe', userPassword: 'password', roles: [] },
          { id: 3, firstName: 'Bob', lastName: 'Smith', age: 35, userName: 'bob.smith', userPassword: 'password', roles: [] }
        ],
        name: 'Association test',
        roles: [],
        minutes: []
      }]);
      jest.spyOn(associationService, 'getAssociations').mockImplementation(() => resultExpected);
      expect(await associationController.getAllAssociations()).toBe(await resultExpected);
    });
  });

  describe('getAssociationById', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28, userName: 'jane.doe', userPassword: 'password', roles: [] },
          { id: 3, firstName: 'Bob', lastName: 'Smith', age: 35, userName: 'bob.smith', userPassword: 'password', roles: [] }
        ],
        name: 'Association test',
        roles: [],
        minutes: []
      });
      jest.spyOn(associationService, 'getAssociationById').mockImplementation(() => resultExpected);
      expect(await associationController.getAssociationById(0)).toBe(await resultExpected);
    });
  });

  describe('getMembersOfAssociation', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all([
        { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'john.doe', userPassword: 'password', roles: [] },
        { id: 1, lastName: 'Doe', firstName: 'Jane', age: 28, userName: 'jane.doe', userPassword: 'password', roles: [] },
        { id: 2, lastName: 'Smith', firstName: 'Bob', age: 35, userName: 'bob.smith', userPassword: 'password', roles: [] }
      ]);
      jest.spyOn(associationService, 'getMembersOfAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.getMembersOfAssociation(0)).toBe(await resultExpected);
    });
  });

  describe('updateAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 1, firstName: 'John', lastName: 'Doe', age: 30, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28, userName: 'jane.doe', userPassword: 'password', roles: [] },
          { id: 3, firstName: 'Bob', lastName: 'Smith', age: 35, userName: 'bob.smith', userPassword: 'password', roles: [] }
        ],
        name: 'Association test',
        roles: [],
        minutes: []
      });
      jest.spyOn(associationService, 'updateAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.updateAssociation(0, {name: 'Doe', idUsers: [1, 2, 3]})).toBe(await resultExpected);
    });
  });

  describe('deleteAssociation', () => {
    it('should return true', async () => {
      const resultExpected = Promise.resolve(true);
      jest.spyOn(associationService, 'deleteAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.deleteAssociation(0)).toBe(await resultExpected);
    });
  });

});
