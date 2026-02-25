import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem, ProductCatalogItem as ProductType } from '@/types';
import AppLayout from '@/layouts/app-layout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface Props {
  product: ProductType;
  categories: string[];
}

interface ProductFormData {
  _method: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit_price: string;
  currency: string;
  is_active: boolean;
}

const breadcrumbs = (product: ProductType): BreadcrumbItem[] => [
  { title: 'Dashboard', href: route('dashboard') },
  { title: 'Product Catalog', href: route('products.index') },
  { title: `Edit: ${product.name}`, href: route('products.edit', product.id) },
];

const ProductEdit: React.FC<Props> = ({ product, categories }) => {
  const { data, setData, post, processing, errors } = useForm<ProductFormData>({
    _method: 'PUT',
    sku: product.sku || '',
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    unit_price: product.unit_price?.toString() || '',
    currency: (product as any).currency || 'SAR',
    is_active: (product as any).is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Inertia uses POST with _method spoofing for PUT/PATCH with files, 
    // but here we can just use the post method as we included _method: 'PUT'
    post(route('products.update', product.id), {
      onSuccess: () => {
        toast.success('Product updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update product. Please check the form.');
      }
    });
  };

  const currencyOptions = [
    { code: 'SAR', label: 'Saudi Riyal (SAR)' },
    { code: 'AED', label: 'UAE Dirham (AED)' },
    { code: 'USD', label: 'US Dollar (USD)' },
    { code: 'EUR', label: 'Euro (EUR)' },
    { code: 'GBP', label: 'British Pound (GBP)' },
    { code: 'EGP', label: 'Egyptian Pound (EGP)' },
    { code: 'SDG', label: 'Sudanese Pound (SDG)' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs(product)}>
      <Head title={`Edit Product - ${product.name}`} />

      <div className="py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Product: {product.name}</CardTitle>
            <CardDescription>Update the details and pricing for this catalog item.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Code (Optional)</Label>
                  <Input
                    id="sku"
                    value={data.sku}
                    onChange={e => setData('sku', e.target.value)}
                    placeholder="e.g. SW-ERP-01"
                  />
                  {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={data.category}
                    onValueChange={(val: string) => setData('category', val)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      {categories.filter(c => !['Software', 'Hardware', 'Service', 'Consulting', 'Subscription'].includes(c)).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Default Unit Price <span className="text-red-500">*</span></Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    value={data.unit_price}
                    onChange={e => setData('unit_price', e.target.value)}
                    required
                  />
                  {errors.unit_price && <p className="text-sm text-red-500">{errors.unit_price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={data.currency}
                    onValueChange={(val: string) => setData('currency', val)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map(opt => (
                        <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <Checkbox
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(val: boolean) => setData('is_active', val)}
                />
                <Label htmlFor="is_active">Available in Catalog (Active)</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link href={route('products.index')}>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProductEdit;
