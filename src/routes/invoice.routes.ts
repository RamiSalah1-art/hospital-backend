import { Router } from 'express';
import { getAllInvoices, getPatientInvoices, createInvoice, addPayment } from '../controllers/invoice.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', getAllInvoices);
router.get('/patient/:patientId', getPatientInvoices);
router.post('/', authorize('ADMIN', 'RECEPTIONIST'), createInvoice);
router.put('/:id/payment', authorize('ADMIN', 'RECEPTIONIST'), addPayment);

export default router;