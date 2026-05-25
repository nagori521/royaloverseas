import mongoose from 'mongoose';
import User from './server/models/User.js';
import Role from './server/models/Role.js';
import { ROLE_PERMISSIONS } from './server/middleware/permissionMatrix.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/royaloverseas');
    console.log('Connected to MongoDB');

    // Seed roles
    for (const [key, roleData] of Object.entries(ROLE_PERMISSIONS)) {
      const existingRole = await Role.findOne({ name: roleData.role });

      if (existingRole) {
        console.log(`Role "${roleData.role}" already exists`);
      } else {
        const role = new Role({
          name: roleData.role,
          displayName: roleData.displayName,
          description: roleData.description,
          permissions: roleData.permissions,
          status: 'active',
        });

        await role.save();
        console.log(`✓ Created role: ${roleData.role}`);
      }
    }

    // Create default super_admin user if doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@royaloverseas.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Super admin user already exists: ${adminEmail}`);
    } else {
      const admin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'super_admin',
        permissions: ROLE_PERMISSIONS.super_admin.permissions,
        status: 'active',
      });

      await admin.save();
      console.log(`✓ Created super admin user: ${adminEmail}`);
    }

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedRoles();
