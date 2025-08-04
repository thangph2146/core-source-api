import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../../../generated/prisma';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'test1@example.com',
          name: 'Test User 1',
          password: null,
          isEmailVerified: false,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Test User 2',
          password: null,
          isEmailVerified: false,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockUsersService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createData = {
        email: 'newuser@example.com',
        name: 'New User',
      };

      const mockCreatedUser: User = {
        id: 3,
        email: createData.email,
        name: createData.name,
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createData);
    });

    it('should create a user without name', async () => {
      const createData = {
        email: 'userwithoutname@example.com',
      };

      const mockCreatedUser: User = {
        id: 4,
        email: createData.email,
        name: null,
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const mockUpdatedUser: User = {
        id: 1,
        email: 'test@example.com',
        name: updateData.name,
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update('1', updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should update user email', async () => {
      const updateData = {
        email: 'updated@example.com',
      };

      const mockUpdatedUser: User = {
        id: 1,
        email: updateData.email,
        name: 'Test User',
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update('1', updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockDeletedUser: User = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: null,
        isEmailVerified: false,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.delete.mockResolvedValue(mockDeletedUser);

      const result = await controller.delete('1');

      expect(result).toEqual(mockDeletedUser);
      expect(mockUsersService.delete).toHaveBeenCalledWith(1);
    });
  });
});
