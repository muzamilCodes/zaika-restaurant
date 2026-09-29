import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField, FormTextArea } from '../../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { Seo } from '../../components/Seo.jsx';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const loadCategories = async () => {
    const response = await api.get('/categories');
    setCategories(response.data.categories || []);
  };

  useEffect(() => {
    loadCategories().catch(() => setError('Categories could not be loaded.'));
  }, []);

  const onSubmit = async (values) => {
    try {
      setError('');
      setStatus('');
      await api.post('/categories', {
        ...values,
        isActive: true
      });
      reset();
      setStatus('Category created.');
      await loadCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create category.');
    }
  };

  const deleteCategory = async (id) => {
    try {
      setError('');
      await api.delete(`/categories/${id}`);
      setStatus('Category deleted.');
      await loadCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete category.');
    }
  };

  return (
    <>
      <Seo title="Admin Categories" description="Manage menu categories." />
      <SectionHeading eyebrow="Categories" title="Category management" />
      {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Icon" {...register('icon')} />
          <FormTextArea label="Description" className="md:col-span-2" {...register('description')} />
          <div className="md:col-span-2">
            <Button type="submit" className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              Add category
            </Button>
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <GlassCard key={category._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{category.name}</p>
              <p className="text-sm text-white/65">{category.description}</p>
            </div>
            <Button
              type="button"
              onClick={() => deleteCategory(category._id)}
              className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            >
              Delete
            </Button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
