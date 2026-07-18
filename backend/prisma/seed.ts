import 'dotenv/config';
import { PrismaClient, AuthProvider, UserRole, SubscriptionTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@1234', 12);

  const demo = await prisma.user.upsert({
    where: { email: 'demo@learnixo.app' },
    update: {},
    create: {
      firstName: 'Alex',
      lastName: 'Student',
      username: 'alex_student',
      email: 'demo@learnixo.app',
      passwordHash,
      provider: AuthProvider.EMAIL,
      role: UserRole.STUDENT,
      subscriptionTier: SubscriptionTier.FREE,
      isVerified: true,
      subscription: {
        create: {
          tier: SubscriptionTier.FREE,
        },
      },
    },
  });

  console.info(`Seeded demo user: ${demo.email} / Demo@1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
