import { Test, TestingModule } from '@nestjs/testing';
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


describe('AssociationsService', () => {
  let associationService: AssociationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssociationsService,
        {
          provide: 'ASSOCIATIONS_REPOSITORY',
          useFactory: repositoryMockFactory
        },
      ],
      imports: [UsersModule],
    }).compile();

    associationService = module.get<AssociationsService>(AssociationsService);
  });


  it('should be defined', () => {
    expect(associationService).toBeDefined();
  });

  describe('createAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve(associations[0]);
      jest.spyOn(associationService, 'createAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.createAssociation({ idUsers: [1, 2, 3], name: 'Association test', description: '' })).toBe(await resultExpected);
    });
  });

  describe('getAllAssociations', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all(associations);
      jest.spyOn(associationService, 'getAllAssociations').mockImplementation(() => resultExpected);
      expect(await associationService.getAllAssociations()).toBe(await resultExpected);
    });
  });

  describe('getAssociationById', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve(associations[0]);
      jest.spyOn(associationService, 'getAssociationById').mockImplementation(() => resultExpected);
      expect(await associationService.getAssociationById(0)).toBe(await resultExpected);
    });
  });

  describe('getMembersOfAssociation', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all([
        { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'doe.john', mail : 'doe.john@example.com', userPassword: 'password', roles: [], associations: []}
      ]);
      jest.spyOn(associationService, 'getMembersOfAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.getMembersOfAssociation(0)).toBe(await resultExpected);
    });
  });

  describe('updateAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve(associations[0]);
      jest.spyOn(associationService, 'updateAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.updateAssociation(0, { idUsers: [1, 2, 3], name: 'Association test' })).toBe(await resultExpected);
    });
  });

  describe('deleteAssociation', () => {
    it('should return an boolean', async () => {
      const resultExpected = Promise.resolve(true);
      jest.spyOn(associationService, 'deleteAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.deleteAssociation(0)).toBe(await resultExpected);
    });
  });

});
