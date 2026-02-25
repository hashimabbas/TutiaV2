import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
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
  defaultCurrency: string;
  categories: string[];
}

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  category: string;
  unit_price: string;
  currency: string;
  is_active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: route('dashboard') },
  { title: 'Product Catalog', href: route('products.index') },
  { title: 'Add Product', href: route('products.create') },
];

const ProductCreate: React.FC<Props> = ({ defaultCurrency, categories }) => {
  const { data, setData, post, processing, errors, reset } = useForm<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    category: '',
    unit_price: '',
    currency: defaultCurrency || 'SAR',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('products.store'), {
      onSuccess: () => {
        toast.success('Product added to catalog successfully!');
        reset();
      },
      onError: () => {
        toast.error('Failed to add product. Please check the form.');
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add New Product" />

      <div className="py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Define a new standardized product or service for your catalog.</CardDescription>
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
                  placeholder="e.g. Enterprise Cloud Hosting"
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
                  placeholder="Brief details about the product..."
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
                    placeholder="0.00"
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
                  {processing ? 'Saving...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProductCreate;
