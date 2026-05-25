import Gallery from '../models/Gallery.js';

function uploadedImageUrl(file) {
  // Prefer Cloudinary secure_url when available.
  // product module already uses CloudinaryStorage, which provides secure_url.
  return file?.secure_url || file?.url || file?.path;
}


export async function getGallery(req, res) {

  const images = await Gallery.find().sort({ createdAt: -1 });
  res.json(images);
}

export async function createGalleryImage(req, res) {
  const image = req.file ? uploadedImageUrl(req.file) : req.body.image;
  if (!image) return res.status(400).json({ message: 'Gallery image is required' });

  const galleryImage = await Gallery.create({ ...req.body, image });
  res.status(201).json(galleryImage);
}


export async function updateGalleryImage(req, res) {
  const image = req.file ? uploadedImageUrl(req.file) : undefined;
  const update = {
    ...(req.body.title !== undefined && { title: req.body.title }),
    ...(req.body.category !== undefined && { category: req.body.category }),
    ...(image && { image }),
  };
  const galleryImage = await Gallery.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!galleryImage) return res.status(404).json({ message: 'Gallery image not found' });
  res.json(galleryImage);
}


export async function deleteGalleryImage(req, res) {
  const galleryImage = await Gallery.findByIdAndDelete(req.params.id);
  if (!galleryImage) return res.status(404).json({ message: 'Gallery image not found' });
  res.json({ message: 'Gallery image deleted' });
}
