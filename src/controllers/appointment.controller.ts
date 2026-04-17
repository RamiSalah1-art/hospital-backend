import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({ orderBy: { date: 'desc' }, include: { patient: true, doctor: true } });
    res.json(appointments);
  } catch { res.status(500).json({ error: 'Failed to load appointments' }); }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, date, time } = req.body;
    const appointment = await prisma.appointment.create({ data: { patientId: Number(patientId), doctorId: Number(doctorId), date: new Date(date), time }, include: { patient: true, doctor: true } });
    res.status(201).json(appointment);
  } catch { res.status(500).json({ error: 'Failed to create appointment' }); }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({ where: { id: Number(req.params.id) }, data: { status } });
    res.json(appointment);
  } catch { res.status(500).json({ error: 'Failed to update status' }); }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete appointment' }); }
};