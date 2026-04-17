import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(doctors);
  } catch { res.status(500).json({ error: 'Failed to load doctors' }); }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: Number(req.params.id) } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch { res.status(500).json({ error: 'Failed to load doctor' }); }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.create({ data: req.body });
    res.status(201).json(doctor);
  } catch { res.status(500).json({ error: 'Failed to create doctor' }); }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(doctor);
  } catch { res.status(500).json({ error: 'Failed to update doctor' }); }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete doctor' }); }
};