import { Router } from 'express';
import { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', authorize('ADMIN', 'RECEPTIONIST'), createPatient);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST'), updatePatient);
router.delete('/:id', authorize('ADMIN'), deletePatient);
export default router;