import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Building2,
  Wallet,
  Bitcoin,
  Smartphone,
  Star,
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

const PAYMENT_TYPES = [
  'bank',
  'paypal',
  'stripe',
  'wise',
  'crypto',
  'upi',
  'venmo',
  'cashapp',
  'platform',
  'wallet',
  'other',
] as const;

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bank: Building2,
  paypal: Wallet,
  stripe: CreditCard,
  wise: Wallet,
  crypto: Bitcoin,
  upi: Smartphone,
  venmo: Wallet,
  cashapp: Wallet,
  platform: CreditCard,
  wallet: Wallet,
  other: CreditCard,
};

const formSchema = z.object({
  type: z.enum(PAYMENT_TYPES),
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string(),
  instructions: z.string(),
  icon: z.string(),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
  order: z.number().min(0),
  // Bank fields
  accountName: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  routingNumber: z.string(),
  swift: z.string(),
  iban: z.string(),
  // Crypto fields
  network: z.string(),
  address: z.string(),
  qrCode: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface PaymentOptionDoc {
  id: string;
  type: string;
  name: string;
  displayName: string;
  description?: string;
  instructions?: string;
  icon?: string;
  isActive: boolean;
  isPrimary: boolean;
  order: number;
  // Bank fields
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  routingNumber?: string;
  swift?: string;
  iban?: string;
  // Crypto fields
  network?: string;
  address?: string;
  qrCode?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

/**
 * Get the icon component for a payment type.
 */
function getTypeIcon(type: string): React.ComponentType<{ className?: string }> {
  return TYPE_ICONS[type] ?? CreditCard;
}

/**
 * Skeleton loader for payment cards.
 */
function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-10 w-10 rounded-lg bg-surface-200" />
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

export default function PaymentOptionsAdminPage() {
  const { isAdmin, user } = useAuth();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<PaymentOptionDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingOption, setDeletingOption] = useState<PaymentOptionDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'bank',
      name: '',
      displayName: '',
      description: '',
      instructions: '',
      icon: '',
      isActive: true,
      isPrimary: false,
      order: 0,
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      swift: '',
      iban: '',
      network: '',
      address: '',
      qrCode: '',
    },
  });

  const watchType = watch('type');
  const watchIsActive = watch('isActive');
  const watchIsPrimary = watch('isPrimary');

  const fetchPaymentOptions = useCallback(async () => {
    try {
      setError(null);
      const q = query(collection(db, 'portfolio_payment_options'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as PaymentOptionDoc[];
      setPaymentOptions(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payment options';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackPageView('/admin/payment-options', 'Payment Options Admin');
    fetchPaymentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the dialog in create mode with default form values.
   */
  function openCreateDialog() {
    setEditingOption(null);
    const nextOrder = paymentOptions.length > 0 ? Math.max(...paymentOptions.map((o) => o.order)) + 1 : 0;
    reset({
      type: 'bank',
      name: '',
      displayName: '',
      description: '',
      instructions: '',
      icon: '',
      isActive: true,
      isPrimary: false,
      order: nextOrder,
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      swift: '',
      iban: '',
      network: '',
      address: '',
      qrCode: '',
    });
    setDialogOpen(true);
  }

  /**
   * Opens the dialog in edit mode with pre-filled option data.
   */
  function openEditDialog(option: PaymentOptionDoc) {
    setEditingOption(option);
    reset({
      type: option.type as FormData['type'],
      name: option.name,
      displayName: option.displayName,
      description: option.description ?? '',
      instructions: option.instructions ?? '',
      icon: option.icon ?? '',
      isActive: option.isActive,
      isPrimary: option.isPrimary,
      order: option.order,
      accountName: option.accountName ?? '',
      accountNumber: option.accountNumber ?? '',
      bankName: option.bankName ?? '',
      routingNumber: option.routingNumber ?? '',
      swift: option.swift ?? '',
      iban: option.iban ?? '',
      network: option.network ?? '',
      address: option.address ?? '',
      qrCode: option.qrCode ?? '',
    });
    setDialogOpen(true);
  }

  /**
   * Handles form submission for creating or updating a payment option.
   */
  async function onSubmit(data: FormData) {
    // Check if trying to set as primary when another is already primary
    if (data.isPrimary && !editingOption?.isPrimary) {
      const existingPrimary = paymentOptions.find((o) => o.isPrimary && o.id !== editingOption?.id);
      if (existingPrimary) {
        const confirmed = window.confirm(
          `"${existingPrimary.displayName}" is currently the primary payment option. Setting "${data.displayName}" as primary will remove the primary status from "${existingPrimary.displayName}". Continue?`
        );
        if (!confirmed) return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const optionData: Record<string, unknown> = {
        type: data.type,
        name: data.name,
        displayName: data.displayName,
        description: data.description || undefined,
        instructions: data.instructions || undefined,
        icon: data.icon || undefined,
        isActive: data.isActive,
        isPrimary: data.isPrimary,
        order: data.order,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? 'unknown',
      };

      // Add type-specific fields
      if (data.type === 'bank') {
        optionData.accountName = data.accountName || undefined;
        optionData.accountNumber = data.accountNumber || undefined;
        optionData.bankName = data.bankName || undefined;
        optionData.routingNumber = data.routingNumber || undefined;
        optionData.swift = data.swift || undefined;
        optionData.iban = data.iban || undefined;
      } else if (data.type === 'crypto') {
        optionData.network = data.network || undefined;
        optionData.address = data.address || undefined;
        optionData.qrCode = data.qrCode || undefined;
      }

      // If setting as primary, remove primary from others
      if (data.isPrimary) {
        const otherPrimary = paymentOptions.find((o) => o.isPrimary && o.id !== editingOption?.id);
        if (otherPrimary) {
          await updateDoc(doc(db, 'portfolio_payment_options', otherPrimary.id), {
            isPrimary: false,
            updatedAt: serverTimestamp(),
          });
        }
      }

      if (editingOption) {
        const docRef = doc(db, 'portfolio_payment_options', editingOption.id);
        await updateDoc(docRef, optionData);
        setSuccessMessage(`Payment option "${data.displayName}" updated successfully!`);
        trackEvent('admin_payment_option_updated', { optionId: editingOption.id });
      } else {
        await addDoc(collection(db, 'portfolio_payment_options'), {
          ...optionData,
          createdAt: serverTimestamp(),
        });
        setSuccessMessage(`Payment option "${data.displayName}" created successfully!`);
        trackEvent('admin_payment_option_created');
      }

      setDialogOpen(false);
      fetchPaymentOptions();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save payment option';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /**
   * Handles payment option deletion after confirmation.
   */
  async function handleDelete() {
    if (!deletingOption) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'portfolio_payment_options', deletingOption.id));
      setSuccessMessage(`Payment option "${deletingOption.displayName}" deleted successfully!`);
      trackEvent('admin_payment_option_deleted', { optionId: deletingOption.id });
      setDeleteDialogOpen(false);
      setDeletingOption(null);
      fetchPaymentOptions();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete payment option';
      setError(message);
    } finally {
      setDeleting(false);
    }
  }

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
              <span className="text-white">Payment Options</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <CreditCard className="h-8 w-8" />
                  Payment Options
                </h1>
                <p className="text-violet-200 mt-1">
                  Manage payment methods for receiving payments and donations.
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
                  Add Payment Option
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

        {/* Payment Options Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : paymentOptions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <CreditCard className="h-12 w-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No payment options yet</p>
              <p className="text-surface-400 text-sm mt-1">
                Add your first payment method to get started.
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
            {paymentOptions.map((option) => {
              const IconComponent = getTypeIcon(option.type);
              return (
                <motion.div key={option.id} variants={staggerItem}>
                  <Card className="h-full flex flex-col group hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          {option.isPrimary && (
                            <Badge variant="warning" size="sm" className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Primary
                            </Badge>
                          )}
                          <Badge
                            variant={option.isActive ? 'success' : 'danger'}
                            size="sm"
                          >
                            {option.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-2">{option.displayName}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" size="sm" className="capitalize">
                          {option.type}
                        </Badge>
                        <span className="ml-2 text-surface-400">Order: {option.order}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {option.description && (
                        <p className="text-sm text-surface-600 line-clamp-2">
                          {option.description}
                        </p>
                      )}
                      {option.type === 'bank' && option.bankName && (
                        <div className="mt-2 text-xs text-surface-400">
                          Bank: {option.bankName}
                        </div>
                      )}
                      {option.type === 'crypto' && option.network && (
                        <div className="mt-2 text-xs text-surface-400">
                          Network: {option.network}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-surface-100">
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(option)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeletingOption(option);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Container>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingOption ? 'Edit Payment Option' : 'Add Payment Option'}
            </DialogTitle>
            <DialogDescription>
              {editingOption
                ? 'Update the payment option details below.'
                : 'Add a new payment method for receiving payments.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                        {PAYMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <span className="capitalize">{type}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
              </div>
              <Input
                label="Name (Internal)"
                placeholder="primary_bank"
                error={formErrors.name?.message}
                {...register('name')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                placeholder="Bank Transfer"
                error={formErrors.displayName?.message}
                {...register('displayName')}
              />
              <Input
                label="Order"
                type="number"
                min={0}
                error={formErrors.order?.message}
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="A brief description of this payment method..."
              error={formErrors.description?.message}
              {...register('description')}
            />

            <Textarea
              label="Instructions"
              placeholder="Instructions for how to use this payment method..."
              error={formErrors.instructions?.message}
              {...register('instructions')}
            />

            <Input
              label="Icon URL (optional)"
              placeholder="https://example.com/icon.svg"
              error={formErrors.icon?.message}
              {...register('icon')}
            />

            {/* Bank-specific fields */}
            {watchType === 'bank' && (
              <Card className="border-surface-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Account Name"
                      placeholder="John Doe"
                      error={formErrors.accountName?.message}
                      {...register('accountName')}
                    />
                    <Input
                      label="Account Number"
                      placeholder="1234567890"
                      error={formErrors.accountNumber?.message}
                      {...register('accountNumber')}
                    />
                  </div>
                  <Input
                    label="Bank Name"
                    placeholder="Chase Bank"
                    error={formErrors.bankName?.message}
                    {...register('bankName')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Routing Number"
                      placeholder="021000021"
                      error={formErrors.routingNumber?.message}
                      {...register('routingNumber')}
                    />
                    <Input
                      label="SWIFT Code"
                      placeholder="CHASUS33"
                      error={formErrors.swift?.message}
                      {...register('swift')}
                    />
                    <Input
                      label="IBAN"
                      placeholder="US..."
                      error={formErrors.iban?.message}
                      {...register('iban')}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crypto-specific fields */}
            {watchType === 'crypto' && (
              <Card className="border-surface-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Crypto Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Network"
                    placeholder="Ethereum, Bitcoin, Solana..."
                    error={formErrors.network?.message}
                    {...register('network')}
                  />
                  <Input
                    label="Wallet Address"
                    placeholder="0x..."
                    error={formErrors.address?.message}
                    {...register('address')}
                  />
                  <Input
                    label="QR Code URL"
                    placeholder="https://example.com/qr.png"
                    error={formErrors.qrCode?.message}
                    {...register('qrCode')}
                  />
                </CardContent>
              </Card>
            )}

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                <div>
                  <p className="font-medium text-surface-900">Active</p>
                  <p className="text-sm text-surface-500">
                    Only active payment options are shown to users.
                  </p>
                </div>
                <Switch
                  checked={watchIsActive}
                  onCheckedChange={(checked: boolean) => setValue('isActive', checked, { shouldDirty: true })}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                    watchIsActive ? 'bg-violet-600' : 'bg-surface-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                      watchIsActive ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-surface-200 p-4">
                <div>
                  <p className="font-medium text-surface-900 flex items-center gap-2">
                    Primary
                    <Star className="h-4 w-4 text-amber-500" />
                  </p>
                  <p className="text-sm text-surface-500">
                    Mark as the preferred payment method. Only one can be primary.
                  </p>
                </div>
                <Switch
                  checked={watchIsPrimary}
                  onCheckedChange={(checked: boolean) => setValue('isPrimary', checked, { shouldDirty: true })}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                    watchIsPrimary ? 'bg-amber-500' : 'bg-surface-300'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                      watchIsPrimary ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </Switch>
              </div>
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
              {editingOption ? 'Update Option' : 'Add Option'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Payment Option</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingOption?.displayName}&quot;? This action
              cannot be undone.
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
              Delete Option
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
