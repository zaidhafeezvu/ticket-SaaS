// Prisma seed file for sample data
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10);

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@ticketsaas.com' },
    update: {},
    create: {
      email: 'demo@ticketsaas.com',
      name: 'Demo User',
      emailVerified: true,
    },
  });

  // Create account with password for demo user
  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: 'credential',
        accountId: user.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      accountId: user.id,
      providerId: 'credential',
      password: hashedPassword,
    },
  });

  console.log('✅ Created demo user:', user.email);
  console.log('   Password: demo1234');

  // Create sample tickets
  const tickets = [
    {
      title: 'Taylor Swift - Eras Tour',
      description: 'Experience the spectacular Eras Tour live! This concert features songs from all of Taylor Swift\'s iconic albums.',
      price: 299.99,
      eventDate: new Date('2024-08-15T19:00:00'),
      location: 'MetLife Stadium, East Rutherford, NJ',
      category: 'concerts',
      quantity: 50,
      available: 50,
      sellerId: user.id,
    },
    {
      title: 'NBA Finals - Game 7',
      description: 'Witness history in the making! Championship game with premium courtside access.',
      price: 1200.00,
      eventDate: new Date('2024-06-20T20:30:00'),
      location: 'TD Garden, Boston, MA',
      category: 'sports',
      quantity: 20,
      available: 20,
      sellerId: user.id,
    },
    {
      title: 'Hamilton - Broadway Musical',
      description: 'The revolutionary musical about founding father Alexander Hamilton. Orchestra seating available!',
      price: 179.50,
      eventDate: new Date('2024-07-10T20:00:00'),
      location: 'Richard Rodgers Theatre, New York, NY',
      category: 'theater',
      quantity: 30,
      available: 30,
      sellerId: user.id,
    },
    {
      title: 'Coachella Music Festival',
      description: '3-day festival pass with access to all stages and exclusive VIP areas.',
      price: 599.00,
      eventDate: new Date('2024-04-12T12:00:00'),
      location: 'Empire Polo Club, Indio, CA',
      category: 'festivals',
      quantity: 100,
      available: 100,
      sellerId: user.id,
    },
    {
      title: 'Ed Sheeran World Tour',
      description: 'Intimate acoustic performance featuring hits from all albums plus new material.',
      price: 125.00,
      eventDate: new Date('2024-09-22T19:30:00'),
      location: 'Madison Square Garden, New York, NY',
      category: 'concerts',
      quantity: 75,
      available: 75,
      sellerId: user.id,
    },
    {
      title: 'Super Bowl LIX',
      description: 'The biggest sporting event of the year! Lower bowl seating with incredible views.',
      price: 3500.00,
      eventDate: new Date('2025-02-09T18:30:00'),
      location: 'Caesars Superdome, New Orleans, LA',
      category: 'sports',
      quantity: 10,
      available: 10,
      sellerId: user.id,
    },
    {
      title: 'The Lion King - Broadway',
      description: 'Disney\'s award-winning musical spectacular. Perfect for families!',
      price: 145.00,
      eventDate: new Date('2024-08-05T14:00:00'),
      location: 'Minskoff Theatre, New York, NY',
      category: 'theater',
      quantity: 40,
      available: 40,
      sellerId: user.id,
    },
    {
      title: 'Lollapalooza Chicago',
      description: '4-day music festival featuring rock, pop, hip-hop, and electronic artists.',
      price: 450.00,
      eventDate: new Date('2024-08-01T11:00:00'),
      location: 'Grant Park, Chicago, IL',
      category: 'festivals',
      quantity: 80,
      available: 80,
      sellerId: user.id,
    },
  ];

  for (const ticketData of tickets) {
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });
    console.log('✅ Created ticket:', ticket.title);
  }

  console.log('✨ Seeding completed successfully!');
  console.log(`📊 Created ${tickets.length} sample tickets`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
