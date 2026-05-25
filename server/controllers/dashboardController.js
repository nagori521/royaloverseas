import Gallery from '../models/Gallery.js';
import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';

export async function getDashboardStats(req, res) {
  const [totalProducts, totalInquiries, galleryCount, customerCountries] = await Promise.all([
    Product.countDocuments(),
    Inquiry.countDocuments(),
    Gallery.countDocuments(),
    Inquiry.distinct('country'),
  ]);

  res.json({
    totalProducts,
    totalInquiries,
    totalCustomers: customerCountries.length,
    galleryCount,
  });
}
