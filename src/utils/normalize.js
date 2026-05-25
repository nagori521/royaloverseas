import { apiImage } from '../services/api.js';

export function normalizeProduct(product) {
  return {
    ...product,
    id: product.id || product._id,
    name: product.name || product.title,
    title: product.title || product.name,
    image: apiImage(product.image || product.images?.[0]),
    gallery: product.gallery || product.images?.map(apiImage) || [apiImage(product.image || product.images?.[0])],
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
