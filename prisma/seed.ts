import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'User One',
      email: 'user1@gmail.com',
      password: 'User1@123',
      mobile: '9999999991',
    },
    {
      name: 'User Two',
      email: 'user2@gmail.com',
      password: 'User2@123',
      mobile: '9999999992',
    },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        mobile: userData.mobile,
      },
    });

    console.log(`✅ Created user: ${user.email}`);

    for (let p = 1; p <= 2; p++) {
      const project = await prisma.project.create({
        data: {
          title: `Project ${p} of ${user.name}`,
          description: `This is project ${p} for ${user.name}`,
          status: p % 2 === 0 ? 'completed' : 'active',
          userId: user.id,
        },
      });

      console.log(`📁 Created project: ${project.title}`);

      for (let t = 1; t <= 3; t++) {
        const status = t === 1 ? 'todo' : t === 2 ? 'in-progress' : 'done';

        await prisma.task.create({
          data: {
            title: `Task ${t} of ${project.title}`,
            description: `This is task ${t} for ${project.title}`,
            status,
            dueDate: new Date(),
            projectId: project.id,
          },
        });
      }

      console.log(`📝 3 tasks created for project: ${project.title}`);
    }
  }

  console.log("🎉 All users, projects, and tasks seeded successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error("❌ Error seeding:", error);
    prisma.$disconnect();
    process.exit(1);
  });
