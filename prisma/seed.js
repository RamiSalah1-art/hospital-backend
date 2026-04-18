const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات...');

  // Users
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: 'admin123', role: 'ADMIN' },
  });
  console.log('✅ admin created');

  const receptionist = await prisma.user.upsert({
    where: { username: 'receptionist' },
    update: {},
    create: { username: 'receptionist', password: 'reception123', role: 'RECEPTIONIST' },
  });
  console.log('✅ receptionist created');

  // Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      hospitalName: 'مستشفى السلام الدولي',
      address: 'الخرطوم، السودان',
      phone: '+249 123 456 789',
      email: 'info@alsalam-hospital.sd',
      taxNumber: '123456789',
    },
  });
  console.log('✅ Settings created');

  console.log('🎉 تمت إضافة البيانات بنجاح!');
}

main()
  .catch((e) => console.error('❌ خطأ:', e))
  .finally(() => prisma.$disconnect());