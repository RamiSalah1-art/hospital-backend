import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user.id, user.role);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role: role || 'ADMIN' },
    });
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
   await prisma.user.delete({ where: { username: String(req.params.username) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, role: true, createdAt: true } });
  res.json(user);
};
