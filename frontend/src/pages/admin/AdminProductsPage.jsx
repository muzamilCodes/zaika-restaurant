import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField, FormTextArea } from '../../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { Seo } from '../../components/Seo.jsx';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const loadProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data.products || []);
  };

  const loadCategories = async () => {
    const response = await api.get('/categories');
    setCategories(response.data.categories || []);
  };

  useEffect(() => {
    loadProducts().catch(() => setError('Products could not be loaded.'));
    loadCategories().catch(() => setError('Categories could not be loaded.'));
  }, []);

  const onSubmit = async (values) => {
    try {
      setError('');
      setStatus('');
      const payload = {
        name: values.name,
        price: Number(values.price),
        category: values.category,
        images: values.image ? [values.image] : [],
        description: values.description,
        isFeatured: true
      };

      if (selected) {
        await api.patch(`/products/${selected._id}`, payload);
        setStatus('Product updated.');
      } else {
        await api.post('/products', payload);
        setStatus('Product created.');
      }

      reset();
      setSelected(null);
      await loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save product.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      setError('');
      await api.delete(`/products/${id}`);
      setStatus('Product deleted.');
      await loadProducts();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete product.');
    }
  };

  return (
    <>
      <Seo title="Admin Products" description="Manage menu items." />
      <SectionHeading eyebrow="Menu management" title="Products" />
      {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Price" type="number" {...register('price')} />
          <FormField label="Image URL" {...register('image')} />
          <FormTextArea label="Description" className="md:col-span-2" {...register('description')} />
          <div>
            <label className="mb-2 block text-sm text-white/70">Category</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
              defaultValue=""
              {...register('category')}
            >
              <option value="" disabled className="bg-[#181410] text-white/50">
                Select category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id} className="bg-[#181410] text-white">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="bg-gold text-surface-900 hover:bg-[#efcf88]">
              {selected ? 'Update product' : 'Add product'}
            </Button>
            {selected ? (
              <Button
                type="button"
                onClick={() => {
                  setSelected(null);
                  reset();
                }}
                className="ml-3 border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 space-y-4">
        {products.length ? (
          products.map((product) => (
            <GlassCard key={product._id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40">
                    No image
                  </div>
                )}
                <div>
                  <p className="font-display text-xl text-white">{product.name}</p>
                  <p className="text-sm text-gold font-medium">Rs. {product.price}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {product.category?.name || 'Uncategorized'} • {product.isVeg ? 'Veg' : 'Non-Veg'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setSelected(product);
                    reset({
                      name: product.name,
                      price: product.price,
                      category: product.category?._id || product.category || '',
                      image: product.images?.[0] || '',
                      description: product.description
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border border-white/10 bg-white/5 text-white hover:bg-white/10 text-sm"
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => deleteProduct(product._id)}
                  className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 text-sm"
                >
                  Delete
                </Button>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="p-8 text-center text-white/60">
            No dishes found in menu yet.
          </GlassCard>
        )}
      </div>
    </>
  );
}
