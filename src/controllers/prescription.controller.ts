import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getPatientPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: Number(req.params.patientId) },
      include: { doctor: true },
      orderBy: { prescribedAt: 'desc' },
    });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, medications, instructions } = req.body;
    const prescription = await prisma.prescription.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        medications: JSON.stringify(medications),
        instructions,
      },
      include: { doctor: true },
    });
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};