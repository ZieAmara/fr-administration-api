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

const associations = [
  {
    id: 0,
    users: [
      { id: 1, firstName: 'John', lastName: 'Doe', age: 30, userName: 'john.doe', mail : 'john.doe@example.com', userPassword: 'password', roles: [], associations: [] },
      { id: 2, firstName: 'Jane', lastName: 'Doe', age: 28, userName: 'jane.doe', mail : 'jane.doe@example.com', userPassword: 'password', roles: [], associations: [] },
      { id: 3, firstName: 'Bob', lastName: 'Smith', age: 35, userName: 'bob.smith', mail : 'bob.smith@example.com', userPassword: 'password', roles: [], associations: [] }
    ],
    name: 'Association test',
    description: '',
    roles: [],
    minutes: []
  }
]

const resultExpectedDto = [
  {
    id: 0,
    members: [
      { id: 1, firstName: 'John', lastName: 'Doe', userName: 'john.doe', mail: 'john.doe@example.com', age: 30, role: '' },
      { id: 2, firstName: 'Jane', lastName: 'Doe', userName: 'jane.doe', mail: 'jane.doe@example.com', age: 28, role: '' },
      { id: 3, firstName: 'Bob', lastName: 'Smith', userName: 'bob.smith', mail: 'bob.smith@example.com', age: 35, role: '' }
    ],
    name: 'Association test', 
    description: '',
    minutes: []
  }
]


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
      const associationExpected = Promise.resolve(associations[0]);
      const resultExpected = Promise.resolve(resultExpectedDto[0]);
      jest.spyOn(associationService, 'createAssociation').mockImplementation(() => associationExpected);
      expect(await associationController.createAssociation({idUsers: [1, 2, 3], name: 'Association test', description: ''})).toEqual(await resultExpected);
    });
  });


  describe('getAllAssociations', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all(associations);
      jest.spyOn(associationService, 'getAllAssociations').mockImplementation(() => resultExpected);
      expect(await associationController.getAllAssociations()).toEqual(resultExpectedDto);
    });
  });


  describe('getAssociationById', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve(associations[0]);
      jest.spyOn(associationService, 'getAssociationById').mockImplementation(() => resultExpected);
      expect(await associationController.getAssociationById(0)).toEqual(await resultExpectedDto[0]);
    });
  });


  describe('getMembersOfAssociation', () => {
    it('should return an array of associations', async () => {
      const users = associations.map(association => association.users);
      const resultExpected = Promise.all(users[0]);
      jest.spyOn(associationService, 'getMembersOfAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.getMembersOfAssociation(0)).toEqual(await resultExpectedDto[0].members);
    });
  });


  describe('updateAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve(associations[0]);
      jest.spyOn(associationService, 'updateAssociation').mockImplementation(() => resultExpected);
      expect(await associationController.updateAssociation(0, {name: 'Doe', idUsers: [1, 2, 3]})).toEqual(await resultExpectedDto[0]);
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
