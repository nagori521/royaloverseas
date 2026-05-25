import { apiImage } from '../services/api.js';

export function normalizeProduct(product) {
  const images = product.images || [];
  const packaging = product.packaging || '';
  const packagingSizes = product.packagingSizes || (
    Array.isArray(product.packaging)
      ? product.packaging
      : product.packaging
        ? [product.packaging]
        : []
  );
  const primaryImage = apiImage(product.image || images[0]);
  const gallery = product.gallery || (images.length ? images.map(apiImage) : primaryImage ? [primaryImage] : []);

  return {
    ...product,
    id: product.id || product._id,
    name: product.name || product.title,
    title: product.title || product.name,
    images,
    features: product.features || [],
    specifications: product.specifications || [],
    packaging,
    packagingSizes,
    image: primaryImage,
    gallery,
    moq: product.moq || product.MOQ,
    origin: product.origin || 'India',
    qualityGrade: product.qualityGrade || product.status || 'Export Grade',
    shippingAvailability: product.shippingAvailability || 'Air and sea shipment',
    deliveryTime: product.deliveryTime || '7-15 business days',
  };
}

export function normalizeGalleryImage(image) {
  return {
    ...image,
    id: image.id || image._id,
    src: apiImage(image.src || image.image),
  };
}
