import { Router } from 'express';
import { getPatientPrescriptions, createPrescription } from '../controllers/prescription.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/patient/:patientId', getPatientPrescriptions);
router.post('/', authorize('ADMIN', 'DOCTOR'), createPrescription);

export default router;