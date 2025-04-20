import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import {
  createAccountHandler,
  loginHandler,
  getAllAccountsHandler,
  getAccountByIdHandler,
  updateAccountHandler,
  deleteAccountHandler,
} from '../../src/api/controllers/accountController';
import { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount, login } from '../../src/api/service/accountService';
import { Request, Response } from 'express';
import { z } from 'zod';
import { AccountPayloadSchema, LoginPayloadSchema } from '../../src/schema/accountSchemas';

// Mock the account service
vi.mock('../../src/api/service/accountService', () => ({
  createAccount: vi.fn(),
  getAllAccounts: vi.fn(),
  getAccountById: vi.fn(),
  updateAccount: vi.fn(),
  deleteAccount: vi.fn(),
  login: vi.fn(),
}));

describe('Account Controller', () => {
  // Mock data
  const mockAccount = { id: 1, email: 'test@example.com', name: 'Test User' };
  const mockPayload = { email: 'test@example.com', name: 'Test User', password: 'password123' };
  const mockLoginPayload = { email: 'test@example.com', password: 'password123' };
  const mockLoginResponse = { token: 'jwt-token', user: mockAccount };

  // Mock Express Response
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as Response;

  // Set default mockResolvedValue for all service functions at the beginning
  beforeAll(() => {
    (createAccount as any).mockResolvedValue(mockAccount);
    (getAllAccounts as any).mockResolvedValue([mockAccount]);
    (getAccountById as any).mockResolvedValue(mockAccount);
    (updateAccount as any).mockResolvedValue(mockAccount);
    (deleteAccount as any).mockResolvedValue(true);
    (login as any).mockResolvedValue(mockLoginResponse);
  });

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mock calls but keep resolved values
  });

  describe('createAccountHandler', () => {
    it('should create an account and return 201', async () => {
      const mockRequest = { body: mockPayload } as unknown as Request;

      await createAccountHandler(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockAccount,
        message: 'Account created successfully',
      });
    });
});

  describe('loginHandler', () => {
    it('should login user and return 200', async () => {
      const mockRequest = { body: mockLoginPayload } as unknown as Request;

      await loginHandler(mockRequest, mockResponse);

      expect(login).toHaveBeenCalledWith(mockLoginPayload.email, mockLoginPayload.password);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLoginResponse);
    });
});

  describe('getAllAccountsHandler', () => {
    it('should return 200 with all accounts', async () => {
      const mockRequest = {} as unknown as Request;

      await getAllAccountsHandler(mockRequest, mockResponse);

      expect(getAllAccounts).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: [mockAccount] });
    });
  });

  describe('getAccountByIdHandler', () => {
    it('should return 200 with account if found', async () => {
      const mockRequest = { params: { id: '1' } } as unknown as Request;

      await getAccountByIdHandler(mockRequest, mockResponse);

      expect(getAccountById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockAccount });
    });

    it('should return 404 if account not found', async () => {
      const mockRequest = { params: { id: '1' } } as unknown as Request;
      (getAccountById as any).mockResolvedValueOnce(undefined); // Override default

      await getAccountByIdHandler(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });
  });

  describe('updateAccountHandler', () => {
    it('should update account and return 200', async () => {
      const mockRequest = { params: { id: '1' }, body: mockPayload } as unknown as Request;

      await updateAccountHandler(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockAccount,
        message: 'Account updated successfully',
      });
    });

    it('should return 404 if account not found', async () => {
      const mockRequest = { params: { id: '1' }, body: mockPayload } as unknown as Request;
      (updateAccount as any).mockResolvedValueOnce(undefined);

      await updateAccountHandler(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });
  });

  describe('deleteAccountHandler', () => {
    it('should delete account and return 204', async () => {
      const mockRequest = { params: { id: '1' } } as unknown as Request;

      await deleteAccountHandler(mockRequest, mockResponse);

      expect(deleteAccount).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});