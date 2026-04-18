import request from 'supertest';
import express from 'express';
import patientRoutes from '../routes/patient.routes';
import { authenticate, authorize } from '../middleware/auth.middleware';

// Mock middleware للتجاوز
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 1, role: 'ADMIN' };
    next();
  },
  authorize: () => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);

describe('Patients API', () => {
  let createdPatientId: number;

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          age: 30,
          phone: '01234567890',
          address: 'Test Address',
          gender: 'ذكر',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Patient');
      createdPatientId = response.body.id;
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/patients', () => {
    it('should return list of patients', async () => {
      const response = await request(app).get('/api/patients');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return patient by id', async () => {
      const response = await request(app).get(`/api/patients/${createdPatientId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdPatientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const response = await request(app).get('/api/patients/99999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('should update patient', async () => {
      const response = await request(app)
        .put(`/api/patients/${createdPatientId}`)
        .send({ name: 'Updated Patient', age: 31 });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Patient');
      expect(response.body.age).toBe(31);
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should delete patient', async () => {
      const response = await request(app).delete(`/api/patients/${createdPatientId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 404 for deleting non-existent patient', async () => {
      const response = await request(app).delete('/api/patients/99999');
      
      expect(response.status).toBe(404);
    });
  });
});