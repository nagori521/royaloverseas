import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import GalleryFilter from '../components/GalleryFilter.jsx';
import GalleryGrid from '../components/GalleryGrid.jsx';
import GalleryModal from '../components/GalleryModal.jsx';
import { galleryImages as seedGalleryImages } from '../data.js';
import { api } from '../services/api.js';
import { normalizeGalleryImage } from '../utils/normalize.js';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(seedGalleryImages);

  useEffect(() => {
    api.gallery()
      .then((items) => setGalleryImages(items.map(normalizeGalleryImage)))
      .catch(() => setGalleryImages(seedGalleryImages));
  }, []);

  const filteredImages = useMemo(
    () =>
      activeCategory === 'All'
        ? galleryImages
        : galleryImages.filter((image) => image.category === activeCategory),
    [activeCategory],
  );

  return (
    <>
      <section className="bg-royal-blue py-16 text-white sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="container-page text-center"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">Royal Overseas Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
            Explore our products, packaging and export operations.
          </p>
          <div className="mt-8">
            <GalleryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
          </div>
        </motion.div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-page">
          <GalleryGrid images={filteredImages} onPreview={setPreviewImage} />
        </div>
      </section>

      <GalleryModal image={previewImage} onClose={() => setPreviewImage(null)} />
    </>
  );
}
