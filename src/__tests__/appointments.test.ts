import request from 'supertest';
import express from 'express';
import appointmentRoutes from '../routes/appointment.routes';

jest.mock('../middleware/auth.middleware', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 1, role: 'ADMIN' };
    next();
  },
  authorize: () => (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/appointments', appointmentRoutes);

describe('Appointments API', () => {
  let createdAppointmentId: number;
  const patientId = 1;
  const doctorId = 1;

  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .post('/api/appointments')
        .send({
          patientId,
          doctorId,
          date: dateStr,
          time: '10:00',
          notes: 'Test appointment',
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      createdAppointmentId = response.body.id;
    });
  });

  describe('GET /api/appointments', () => {
    it('should return list of appointments', async () => {
      const response = await request(app).get('/api/appointments');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/appointments/:id/status', () => {
    it('should update appointment status', async () => {
      const response = await request(app)
        .put(`/api/appointments/${createdAppointmentId}/status`)
        .send({ status: 'CONFIRMED' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CONFIRMED');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('should delete appointment', async () => {
      const response = await request(app).delete(`/api/appointments/${createdAppointmentId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});