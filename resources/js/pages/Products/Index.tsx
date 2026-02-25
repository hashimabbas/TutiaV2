import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { type BreadcrumbItem, PaginatedData, FlashMessageType, ProductCatalogItem as ProductType } from '@/types';
import AppLayout from '@/layouts/app-layout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Search, X, PlusCircle, Package } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/pagination';
import { Label } from '@/components/ui/label';

interface Props {
  products: PaginatedData<ProductType>;
  filters: {
    search?: string;
    category?: string;
  };
  categories: string[];
  flash?: FlashMessageType;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: route('dashboard') },
  { title: 'Product Catalog', href: route('products.index') }
];

const ProductsIndex: React.FC<Props> = ({ products, filters, categories, flash }) => {
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const { delete: destroy, processing } = useForm({});

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

  const handleFilterChange = () => {
    router.get(route('products.index'), {
      search: searchQuery,
      category: selectedCategory,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    router.get(route('products.index'), {}, {
      preserveState: true,
      replace: true,
    });
  };

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const confirmDelete = () => {
    if (productToDelete === null) return;
    destroy(route('products.destroy', productToDelete), {
      preserveScroll: true,
      onSuccess: () => {
        setProductToDelete(null);
        toast.success('Product deleted successfully.');
      },
      onError: (errors) => {
        setProductToDelete(null);
        console.error("Delete Error:", errors);
        toast.error('Failed to delete product.');
      },
    });
  };

  const formatCurrency = (value?: number | null, currencyCode?: string) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'SAR' }).format(value);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Product Catalog" />

      <div className="w-full py-6 md:py-12">
        <Card className="max-w-full mx-auto">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Product Catalog
                </CardTitle>
                <CardDescription>Manage your company's standardized products and services.</CardDescription>
              </div>
              <Link href={route('products.create')}>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, SKU or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category-filter">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 justify-end">
                <Button onClick={handleFilterChange} className="w-full md:w-auto">
                  Apply
                </Button>
                <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.data.length > 0 ? (
                    products.data.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {product.sku || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category || 'General'}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(product.unit_price, product.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={(product as any).is_active ? 'default' : 'secondary'}>
                            {(product as any).is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Link href={route('products.edit', product.id)}>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => setProductToDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No products found in the catalog.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Pagination links={products.links} />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={productToDelete !== null} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This product will be permanently removed from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={processing}
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Deleting...' : 'Delete Product'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ProductsIndex;
