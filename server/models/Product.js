import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    packaging: { type: String, required: true },
    MOQ: { type: String, required: true },
    countryAvailability: { type: String, default: 'Worldwide' },
    images: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export default mongoose.model('Product', productSchema);
