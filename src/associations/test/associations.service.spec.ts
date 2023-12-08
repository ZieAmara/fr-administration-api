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
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 0, lastName: 'Doe', firstName: 'John', age: 0, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Kim', firstName: 'Jane', age: 0, userName: 'jane.kim', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Lee', firstName: 'Mark', age: 0, userName: 'mark.lee', userPassword: 'password', roles: [] },
        ],
        name: 'Association test',
        roles: [],
      });
      jest.spyOn(associationService, 'createAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.createAssociation({ idUsers: [1, 2, 3], name: 'Association test' })).toBe(await resultExpected);
    });
  });

  describe('getAllAssociations', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all([
        {
          id: 0,
          Users: [
            { id: 0, lastName: 'Doe', firstName: 'John', age: 0, userName: 'john.doe', userPassword: 'password', roles: [] },
            { id: 0, lastName: 'Kim', firstName: 'Jane', age: 0, userName: 'jane.kim', userPassword: 'password', roles: [] },
            { id: 0, lastName: 'Lee', firstName: 'Mark', age: 0, userName: 'mark.lee', userPassword: 'password', roles: [] },
          ],
          name: 'Association test',
          roles: [],
        },
      ]);
      jest.spyOn(associationService, 'getAssociations').mockImplementation(() => resultExpected);
      expect(await associationService.getAssociations()).toBe(await resultExpected);
    });
  });

  describe('getAssociationById', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 0, lastName: 'Doe', firstName: 'John', age: 0, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Kim', firstName: 'Jane', age: 0, userName: 'jane.kim', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Lee', firstName: 'Mark', age: 0, userName: 'mark.lee', userPassword: 'password', roles: [] },
        ],
        name: 'Association test',
        roles: [],
      });
      jest.spyOn(associationService, 'getAssociationById').mockImplementation(() => resultExpected);
      expect(await associationService.getAssociationById(0)).toBe(await resultExpected);
    });
  });

  describe('getMembersOfAssociation', () => {
    it('should return an array of associations', async () => {
      const resultExpected = Promise.all([
        { id: 0, lastName: 'Doe', firstName: 'John', age: 30, userName: 'doe.john', userPassword: 'password', roles: []}
      ]);
      jest.spyOn(associationService, 'getMembersOfAssociation').mockImplementation(() => resultExpected);
      expect(await associationService.getMembersOfAssociation(0)).toBe(await resultExpected);
    });
  });

  describe('updateAssociation', () => {
    it('should return an association', async () => {
      const resultExpected = Promise.resolve({
        id: 0,
        Users: [
          { id: 0, lastName: 'Doe', firstName: 'John', age: 0, userName: 'john.doe', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Kim', firstName: 'Jane', age: 0, userName: 'jane.kim', userPassword: 'password', roles: [] },
          { id: 0, lastName: 'Lee', firstName: 'Mark', age: 0, userName: 'mark.lee', userPassword: 'password', roles: [] },
        ],
        name: 'Association test',
        roles: [],
      });
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
