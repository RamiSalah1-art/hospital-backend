import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// GET /api/medical-records/:patientId
export const getMedicalRecord = async (req: Request, res: Response) => {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { patientId: Number(req.params.patientId) },
    });
    res.json(record || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical record' });
  }
};

// POST /api/medical-records/:patientId
export const createOrUpdateMedicalRecord = async (req: Request, res: Response) => {
  try {
    const patientId = Number(req.params.patientId);
    const { bloodType, allergies, chronicConditions, currentMedications, notes } = req.body;

    const record = await prisma.medicalRecord.upsert({
      where: { patientId },
      update: { bloodType, allergies, chronicConditions, currentMedications, notes },
      create: { patientId, bloodType, allergies, chronicConditions, currentMedications, notes },
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save medical record' });
  }
};