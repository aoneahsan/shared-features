import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { Switch } from '@radix-ui/react-switch';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['app', 'extension', 'website', 'package', 'service']),
  url: z.string().url('Must be a valid URL').or(z.literal('')),
  color: z.string().min(1, 'Color is required'),
  features: z.string(),
  iconUrl: z.string(),
  appStoreUrl: z.string(),
  playStoreUrl: z.string(),
  webStoreUrl: z.string(),
  enabled: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductDoc {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: string;
  url: string;
  color: string;
  features: string[];
  icon64?: string;
  icon128?: string;
  chromeStoreUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  webUrl?: string;
  enabled: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}

const TYPE_BADGE_MAP: Record<string, 'success' | 'info' | 'warning' | 'default'> = {
  app: 'success',
  extension: 'info',
  website: 'warning',
  package: 'default',
  service: 'default',
};

/**
 * Skeleton loader for product grid items.
 */
function ProductCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-surface-200" />
        <div className="h-4 w-32 rounded bg-surface-200 mt-2" />
        <div className="h-3 w-48 rounded bg-surface-200 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-3 w-full rounded bg-surface-100" />
        <div className="h-3 w-3/4 rounded bg-surface-100 mt-2" />
      </CardContent>
    </Card>
  );
}

export default function ProductsAdminPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      type: 'app',
      url: '',
      color: '#7c3aed',
      features: '',
      iconUrl: '',
      appStoreUrl: '',
      playStoreUrl: '',
      webStoreUrl: '',
      enabled: true,
    },
  });

  const watchEnabled = watch('enabled');

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'zaions_products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ProductDoc[];
      setProducts(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/products', 'Products Admin');
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the dialog in create mode with default form values.
   */
  function openCreateDialog() {
    setEditingProduct(null);
    reset({
      name: '',
      tagline: '',
      description: '',
      type: 'app',
      url: '',
      color: '#7c3aed',
      features: '',
      iconUrl: '',
      appStoreUrl: '',
      playStoreUrl: '',
      webStoreUrl: '',
      enabled: true,
    });
    setDialogOpen(true);
  }

  /**
   * Opens the dialog in edit mode with pre-filled product data.
   */
  function openEditDialog(product: ProductDoc) {
    setEditingProduct(product);
    reset({
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      type: product.type as ProductFormData['type'],
      url: product.url ?? '',
      color: product.color ?? '#7c3aed',
      features: (product.features ?? []).join('\n'),
      iconUrl: product.icon64 ?? '',
      appStoreUrl: product.appStoreUrl ?? '',
      playStoreUrl: product.playStoreUrl ?? '',
      webStoreUrl: product.chromeStoreUrl ?? '',
      enabled: product.enabled ?? true,
    });
    setDialogOpen(true);
  }

  /**
   * Handles form submission for creating or updating a product.
   */
  async function onSubmit(data: ProductFormData) {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const featuresArray = data.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const productData = {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        type: data.type,
        url: data.url,
        color: data.color,
        features: featuresArray,
        icon64: data.iconUrl || undefined,
        appStoreUrl: data.appStoreUrl || undefined,
        playStoreUrl: data.playStoreUrl || undefined,
        chromeStoreUrl: data.webStoreUrl || undefined,
        enabled: data.enabled,
        updatedAt: serverTimestamp(),
      };

      if (editingProduct) {
        const docRef = doc(db, 'zaions_products', editingProduct.id);
        await updateDoc(docRef, productData);
        setSuccessMessage(`Product "${data.name}" updated successfully!`);
        trackEvent('admin_product_updated', { productId: editingProduct.id });
      } else {
        await addDoc(collection(db, 'zaions_products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Product "${data.name}" created successfully!`);
        trackEvent('admin_product_created');
      }

      setDialogOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Handles product deletion after confirmation.
   */
  async function handleDelete() {
    if (!deletingProduct) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'zaions_products', deletingProduct.id));
      setSuccessMessage(`Product "${deletingProduct.name}" deleted successfully!`);
      trackEvent('admin_product_deleted', { productId: deletingProduct.id });
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <Container className="py-20">
        <Alert variant="danger">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges to view this page.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <Container className="py-8">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-2 text-violet-200 text-sm mb-2">
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">Products</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Package className="h-8 w-8" />
                  Products
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage the product catalog used for advertising campaigns.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  className="bg-white text-violet-700 hover:bg-violet-50"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Messages */}
        {error && (
          <Alert variant="danger" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No products found</p>
              <p className="text-surface-400 text-sm mt-1">
                {searchQuery ? 'Try a different search term.' : 'Add your first product to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <Card className="h-full flex flex-col group hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: product.color || '#7c3aed' }}
                      >
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={TYPE_BADGE_MAP[product.type] ?? 'default'} size="sm">
                          {product.type}
                        </Badge>
                        <Badge
                          variant={product.enabled ? 'success' : 'danger'}
                          size="sm"
                        >
                          {product.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-2">{product.name}</CardTitle>
                    <CardDescription>{product.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-surface-600 line-clamp-2">
                      {product.description}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {product.features.slice(0, 3).map((f) => (
                          <Badge key={f} variant="outline" size="sm">
                            {f}
                          </Badge>
                        ))}
                        {product.features.length > 3 && (
                          <Badge variant="outline" size="sm">
                            +{product.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2 w-full">
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:text-violet-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDeletingProduct(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the product details below.'
                : 'Add a new product to the catalog for advertising campaigns.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Name"
                placeholder="ZTools"
                error={formErrors.name?.message}
                {...register('name')}
              />
              <Input
                label="Tagline"
                placeholder="Your everyday utility toolkit"
                error={formErrors.tagline?.message}
                {...register('tagline')}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="A comprehensive description of the product"
              error={formErrors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-surface-700">Type</label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <SelectRoot value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="extension">Extension</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="package">Package</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <Input
                label="URL"
                placeholder="https://example.com"
                error={formErrors.url?.message}
                {...register('url')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand Color (hex)"
                type="color"
                error={formErrors.color?.message}
                {...register('color')}
              />
              <Input
                label="Icon URL"
                placeholder="https://example.com/icon.svg"
                error={formErrors.iconUrl?.message}
                {...register('iconUrl')}
              />
            </div>

            <Textarea
              label="Features (one per line)"
              placeholder="Fast & lightweight&#10;Cross-platform&#10;Open source"
              error={formErrors.features?.message}
              {...register('features')}
            />

            <Card className="border-surface-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Store URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="App Store URL"
                  placeholder="https://apps.apple.com/..."
                  error={formErrors.appStoreUrl?.message}
                  {...register('appStoreUrl')}
                />
                <Input
                  label="Play Store URL"
                  placeholder="https://play.google.com/store/apps/..."
                  error={formErrors.playStoreUrl?.message}
                  {...register('playStoreUrl')}
                />
                <Input
                  label="Chrome Web Store URL"
                  placeholder="https://chrome.google.com/webstore/..."
                  error={formErrors.webStoreUrl?.message}
                  {...register('webStoreUrl')}
                />
              </CardContent>
            </Card>

            {/* Enabled Switch */}
            <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
              <div>
                <p className="font-medium text-surface-900">Enabled</p>
                <p className="text-sm text-surface-500">
                  Active products are available for campaigns.
                </p>
              </div>
              <Switch
                checked={watchEnabled}
                onCheckedChange={(checked: boolean) => setValue('enabled', checked, { shouldDirty: true })}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  watchEnabled ? 'bg-violet-600' : 'bg-surface-300'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                    watchEnabled ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </Switch>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={saving}
              disabled={saving}
              onClick={handleSubmit(onSubmit)}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action
              cannot be undone. Campaigns referencing this product may break.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              disabled={deleting}
              onClick={handleDelete}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
