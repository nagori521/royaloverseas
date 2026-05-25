import Product from '../models/Product.js';

function uploadedImageUrl(file) {
  return file?.path || file?.secure_url || file?.url;
}

export async function getProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function createProduct(req, res) {
  const uploadedImages = req.files?.map(uploadedImageUrl).filter(Boolean) || [];
  const images = uploadedImages.length ? uploadedImages : req.body.images || [];
  const product = await Product.create({
    ...req.body,
    title: req.body.title || req.body.name,
    MOQ: req.body.MOQ || req.body.moq,
    images,
  });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const images = req.files?.length ? req.files.map(uploadedImageUrl).filter(Boolean) : undefined;
  const update = {
    ...req.body,
    ...(req.body.name && { title: req.body.name }),
    ...(req.body.moq && { MOQ: req.body.moq }),
    ...(images && { images }),
  };
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
}
