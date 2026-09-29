import { useEffect, useState } from 'react';
import { Seo } from '../components/Seo.jsx';
import { GlassCard, SectionHeading } from '../components/ui.jsx';
import { galleryService } from '../services/galleryService.js';

export function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryService
      .getGalleryItems()
      .then((response) => setItems(response.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo title="Gallery" description="Explore the ambience and food photography at Zaika Restaurant." />
      <SectionHeading eyebrow="Gallery" title="Visual stories from Zaika" description="Every image here comes from admin-managed gallery items." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <GlassCard className="md:col-span-2 xl:col-span-3">Loading gallery...</GlassCard>
        ) : items.length ? (
          items.map((item) => (
            <GlassCard key={item._id} className="overflow-hidden p-0">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title || 'Zaika gallery'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 p-5">
                <p className="font-display text-2xl text-white">{item.title}</p>
                {item.altText ? <p className="text-sm leading-7 text-white/65">{item.altText}</p> : null}
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="md:col-span-2 xl:col-span-3">No gallery items yet.</GlassCard>
        )}
      </div>
    </>
  );
}
