import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField } from '../../components/FormField.jsx';
import { Seo } from '../../components/Seo.jsx';
import { galleryService } from '../../services/galleryService.js';

export function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm({ defaultValues: { isActive: true } });

  const loadItems = async () => {
    const response = await galleryService.getAdminGalleryItems();
    setItems(response.data.items || []);
  };

  useEffect(() => {
    loadItems().catch(() => setError('Gallery could not be loaded.'));
  }, []);

  const onSubmit = async (values) => {
    try {
      setStatus('');
      setError('');
      await galleryService.createGalleryItem({
        title: values.title,
        imageUrl: values.imageUrl,
        altText: values.altText,
        isActive: values.isActive === 'true' || values.isActive === true,
        order: values.order ? Number(values.order) : 0
      });
      reset({ isActive: true });
      setStatus('Gallery image added.');
      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to add gallery image.');
    }
  };

  const deleteItem = async (id) => {
    try {
      setStatus('');
      setError('');
      await galleryService.deleteGalleryItem(id);
      setStatus('Gallery image deleted.');
      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete gallery image.');
    }
  };

  return (
    <>
      <Seo title="Admin Gallery" description="Manage gallery images." />
      <SectionHeading eyebrow="Gallery" title="Gallery management" />
      {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Title" {...register('title', { required: true, minLength: 2 })} />
          <FormField label="Image URL" {...register('imageUrl', { required: true })} />
          <FormField label="Alt text" {...register('altText')} />
          <FormField label="Order" type="number" {...register('order')} />
          <div className="md:col-span-2">
            <Button type="submit" className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              Add image
            </Button>
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item._id} className="overflow-hidden p-0">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img src={item.imageUrl} alt={item.altText || item.title || 'Gallery image'} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="font-display text-2xl">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">{item.isActive ? 'Active' : 'Hidden'}</p>
              </div>
              <Button
                type="button"
                onClick={() => deleteItem(item._id)}
                className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
              >
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
