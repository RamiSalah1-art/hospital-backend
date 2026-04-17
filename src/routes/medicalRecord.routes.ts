import { Router } from 'express';
import { getMedicalRecord, createOrUpdateMedicalRecord } from '../controllers/medicalRecord.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/:patientId', authorize('ADMIN', 'DOCTOR'), getMedicalRecord);
router.post('/:patientId', authorize('ADMIN', 'DOCTOR'), createOrUpdateMedicalRecord);

export default router;