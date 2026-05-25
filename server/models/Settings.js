import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Royal Overseas' },
    logo: { type: String, default: '' },
    email: { type: String, default: 'info@royaloverseas.com' },
    whatsapp: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Royal Overseas Trade Office, Mumbai, India' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

export default mongoose.model('Settings', settingsSchema);
