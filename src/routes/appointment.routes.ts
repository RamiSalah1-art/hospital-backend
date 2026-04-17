import { Router } from 'express';
import { getAllAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getAllAppointments);
router.post('/', authorize('ADMIN', 'RECEPTIONIST'), createAppointment);
router.put('/:id/status', authorize('ADMIN', 'DOCTOR'), updateAppointmentStatus);
router.delete('/:id', authorize('ADMIN'), deleteAppointment);
export default router;