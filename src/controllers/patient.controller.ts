import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(patients);
  } catch { res.status(500).json({ error: 'Failed to load patients' }); }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: Number(req.params.id) } });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch { res.status(500).json({ error: 'Failed to load patient' }); }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await prisma.patient.create({ data: req.body });
    res.status(201).json(patient);
  } catch { res.status(500).json({ error: 'Failed to create patient' }); }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await prisma.patient.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(patient);
  } catch { res.status(500).json({ error: 'Failed to update patient' }); }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    await prisma.patient.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete patient' }); }
};