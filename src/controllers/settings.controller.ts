import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET /api/settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// PUT /api/settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { hospitalName, logo, address, phone, email, taxNumber } = req.body;
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: { hospitalName, logo, address, phone, email, taxNumber },
      create: { hospitalName, logo, address, phone, email, taxNumber },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};