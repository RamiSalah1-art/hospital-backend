import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = password === user.password; // مؤقتاً
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user.id, user.role);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, role: true, createdAt: true } });
  res.json(user);
};