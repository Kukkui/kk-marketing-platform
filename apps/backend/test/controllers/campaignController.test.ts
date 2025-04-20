import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { createCampaignHandler, getAllCampaignsHandler, getCampaignByIdHandler, updateCampaignHandler, deleteCampaignHandler } from '../../src/api/controllers/campaignController';
import * as campaignService from '../../src/api/service/campaignService';
import { Campaign } from '../../src/shared/types/campaignTypes';

// Mock campaignService
vi.mock('../../src/api/service/campaignService');

describe('CampaignController', () => {
  // Mock Request and Response
  const mockRequest = (body = {}, params = {}) => ({
    body,
    params,
  }) as Request;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    res.send = vi.fn().mockReturnThis();
    return res as Response;
  };

  describe('createCampaignHandler', () => {
    it('should create a campaign with valid payload', async () => {
      const payload = {
        campaignName: 'Summer Sale',
        subjectLine: 'Get 20% Off!',
        emailContent: '<p>Shop now!</p>',
      };
      const campaign: Campaign = { id: 1, ...payload };
      vi.spyOn(campaignService, 'createCampaign').mockResolvedValue(campaign);

      const req = mockRequest(payload);
      const res = mockResponse();

      await createCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: campaign,
        message: 'Campaign created successfully',
      });
    });

    it('should return 400 for invalid payload', async () => {
      const invalidPayload = {
        campaignName: '',
        subjectLine: 'Get 20% Off!',
      };
      const req = mockRequest(invalidPayload);
      const res = mockResponse();

      await createCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Validation failed' })
      );
    });
  });

  describe('getAllCampaignsHandler', () => {
    it('should retrieve all campaigns', async () => {
      const campaigns: Campaign[] = [
        { id: 1, campaignName: 'Summer Sale', subjectLine: 'Get 20% Off!', emailContent: '<p>Shop now!</p>' },
      ];
      vi.spyOn(campaignService, 'getAllCampaigns').mockResolvedValue(campaigns);

      const req = mockRequest();
      const res = mockResponse();

      await getAllCampaignsHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: campaigns });
    });
  });

  describe('getCampaignByIdHandler', () => {
    it('should retrieve a campaign by ID', async () => {
      const campaign: Campaign = {
        id: 1,
        campaignName: 'Summer Sale',
        subjectLine: 'Get 20% Off!',
        emailContent: '<p>Shop now!</p>',
      };
      vi.spyOn(campaignService, 'getCampaignById').mockResolvedValue(campaign);

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await getCampaignByIdHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: campaign });
    });

    it('should return 404 if campaign not found', async () => {
      vi.spyOn(campaignService, 'getCampaignById').mockResolvedValue(undefined);

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await getCampaignByIdHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });
  });

  describe('updateCampaignHandler', () => {
    it('should update a campaign with valid payload', async () => {
      const payload = {
        campaignName: 'Winter Sale',
        subjectLine: 'Get 30% Off!',
        emailContent: '<p>Shop now!</p>',
      };
      const updatedCampaign: Campaign = { id: 1, ...payload };
      vi.spyOn(campaignService, 'updateCampaign').mockResolvedValue(updatedCampaign);

      const req = mockRequest(payload, { id: '1' });
      const res = mockResponse();

      await updateCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedCampaign,
        message: 'Campaign updated successfully',
      });
    });

    it('should return 400 for invalid payload', async () => {
      const invalidPayload = {
        campaignName: '',
        subjectLine: 'Get 30% Off!',
      };
      const req = mockRequest(invalidPayload, { id: '1' });
      const res = mockResponse();

      await updateCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Validation failed' })
      );
    });

    it('should return 404 if campaign not found', async () => {
      const payload = {
        campaignName: 'Winter Sale',
        subjectLine: 'Get 30% Off!',
        emailContent: '<p>Shop now!</p>',
      };
      vi.spyOn(campaignService, 'updateCampaign').mockResolvedValue(undefined);

      const req = mockRequest(payload, { id: '1' });
      const res = mockResponse();

      await updateCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });
  });

  describe('deleteCampaignHandler', () => {
    it('should delete a campaign', async () => {
      vi.spyOn(campaignService, 'deleteCampaign').mockResolvedValue(true);

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await deleteCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if campaign not found', async () => {
      vi.spyOn(campaignService, 'deleteCampaign').mockResolvedValue(false);

      const req = mockRequest({}, { id: '1' });
      const res = mockResponse();

      await deleteCampaignHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });
  });
});