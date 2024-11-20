import { createAdminUser } from '../lib/create-admin';

async function main() {
  const email = 'admin@careermentor.ai';
  const password = 'secureAdminPass123!';

  console.log('Creating admin user...');
  const result = await createAdminUser(email, password);

  if (result.success) {
    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } else {
    console.error('Failed to create admin user:', result.error);
  }
}

main().catch(console.error);