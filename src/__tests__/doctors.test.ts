import request from 'supertest';
import express from 'express';
import doctorRoutes from '../routes/doctor.routes';

jest.mock('../middleware/auth.middleware', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 1, role: 'ADMIN' };
    next();
  },
  authorize: () => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/doctors', doctorRoutes);

describe('Doctors API', () => {
  let createdDoctorId: number;

  describe('POST /api/doctors', () => {
    it('should create a new doctor', async () => {
      const response = await request(app)
        .post('/api/doctors')
        .send({
          name: 'Test Doctor',
          specialty: 'Cardiology',
          phone: '01234567891',
          email: 'test@doctor.com',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Doctor');
      createdDoctorId = response.body.id;
    });
  });

  describe('GET /api/doctors', () => {
    it('should return list of doctors', async () => {
      const response = await request(app).get('/api/doctors');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/doctors/:id', () => {
    it('should return doctor by id', async () => {
      const response = await request(app).get(`/api/doctors/${createdDoctorId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdDoctorId);
    });

    it('should return 404 for non-existent doctor', async () => {
      const response = await request(app).get('/api/doctors/99999');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/doctors/:id', () => {
    it('should update doctor', async () => {
      const response = await request(app)
        .put(`/api/doctors/${createdDoctorId}`)
        .send({ name: 'Updated Doctor', specialty: 'Neurology' });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Doctor');
    });
  });

  describe('DELETE /api/doctors/:id', () => {
    it('should delete doctor', async () => {
      const response = await request(app).delete(`/api/doctors/${createdDoctorId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});