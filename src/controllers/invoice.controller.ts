import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const generateInvoiceNo = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const count = await prisma.invoice.count();
  return `INV-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const getPatientInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { patientId: Number(req.params.patientId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { patientId, dueDate, items, subtotal, tax, total, paid, notes } = req.body;
    const invoiceNo = await generateInvoiceNo();
    const balance = total - (paid || 0);
    let status: string = 'UNPAID';
    if (paid >= total) status = 'PAID';
    else if (paid > 0) status = 'PARTIAL';

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        patientId: Number(patientId),
        dueDate: new Date(dueDate),
        items: JSON.stringify(items),
        subtotal,
        tax,
        total,
        paid: paid || 0,
        balance,
        status: status as any,
        notes,
      },
      include: { patient: true },
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const addPayment = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const newPaid = invoice.paid + amount;
    const newBalance = invoice.total - newPaid;
    let status: string = 'UNPAID';
    if (newPaid >= invoice.total) status = 'PAID';
    else if (newPaid > 0) status = 'PARTIAL';

    const updated = await prisma.invoice.update({
      where: { id: Number(req.params.id) },
      data: { paid: newPaid, balance: newBalance, status: status as any },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add payment' });
  }
};