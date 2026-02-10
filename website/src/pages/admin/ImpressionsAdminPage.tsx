import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Download,
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ImpressionDoc {
  id: string;
  campaignId: string;
  productId: string;
  projectId: string;
  platform: string;
  action: string;
  deviceId: string;
  variant: string;
  sessionId: string;
  createdAt: Timestamp;
}

type SortField = 'createdAt' | 'campaignId' | 'productId' | 'projectId' | 'platform' | 'action';
type SortDirection = 'asc' | 'desc';

const ACTION_BADGE_MAP: Record<string, 'default' | 'success' | 'danger'> = {
  impression: 'default',
  click: 'success',
  close: 'danger',
};

const PLATFORM_BADGE_MAP: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  web: 'info',
  android: 'success',
  ios: 'warning',
  extension: 'danger',
};

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-12 rounded bg-surface-100" />
      ))}
    </div>
  );
}

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField; sortDirection: SortDirection }) {
  if (field !== sortField) {
    return <ArrowUpDown className="h-3 w-3 text-surface-400" />;
  }
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3 w-3 text-violet-600" />
  ) : (
    <ArrowDown className="h-3 w-3 text-violet-600" />
  );
}

export default function ImpressionsAdminPage() {
  const { isAdmin } = useAuth();
  const [impressions, setImpressions] = useState<ImpressionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [campaignIdFilter, setCampaignIdFilter] = useState('');
  const [productIdFilter, setProductIdFilter] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const fetchImpressions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      let impressionsQuery = query(
        collection(db, 'zaions_impressions'),
        orderBy('createdAt', 'desc')
      );

      // Apply date filters if present
      if (startDateFilter) {
        impressionsQuery = query(
          collection(db, 'zaions_impressions'),
          where('createdAt', '>=', Timestamp.fromDate(new Date(startDateFilter))),
          orderBy('createdAt', 'desc')
        );
      }

      if (startDateFilter && endDateFilter) {
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        impressionsQuery = query(
          collection(db, 'zaions_impressions'),
          where('createdAt', '>=', Timestamp.fromDate(new Date(startDateFilter))),
          where('createdAt', '<=', Timestamp.fromDate(endDate)),
          orderBy('createdAt', 'desc')
        );
      }

      const snap = await getDocs(impressionsQuery);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ImpressionDoc[];

      setImpressions(docs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch impressions';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [startDateFilter, endDateFilter]);

  useEffect(() => {
    trackPageView('/admin/impressions', 'Impressions Admin');
    fetchImpressions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters and sorting
  const filteredAndSortedImpressions = useMemo(() => {
    let result = [...impressions];

    // Apply filters
    if (campaignIdFilter) {
      result = result.filter((i) =>
        i.campaignId?.toLowerCase().includes(campaignIdFilter.toLowerCase())
      );
    }
    if (productIdFilter) {
      result = result.filter((i) =>
        i.productId?.toLowerCase().includes(productIdFilter.toLowerCase())
      );
    }
    if (projectIdFilter) {
      result = result.filter((i) =>
        i.projectId?.toLowerCase().includes(projectIdFilter.toLowerCase())
      );
    }
    if (platformFilter !== 'all') {
      result = result.filter((i) => i.platform === platformFilter);
    }
    if (actionFilter !== 'all') {
      result = result.filter((i) => i.action === actionFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | number | Date;
      let bVal: string | number | Date;

      if (sortField === 'createdAt') {
        aVal = a.createdAt?.toMillis() || 0;
        bVal = b.createdAt?.toMillis() || 0;
      } else {
        aVal = (a[sortField] || '').toLowerCase();
        bVal = (b[sortField] || '').toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return result;
  }, [impressions, campaignIdFilter, productIdFilter, projectIdFilter, platformFilter, actionFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedImpressions.length / pageSize);
  const paginatedImpressions = filteredAndSortedImpressions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  }

  function handleApplyFilters() {
    setCurrentPage(1);
    fetchImpressions();
  }

  function handleClearFilters() {
    setCampaignIdFilter('');
    setProductIdFilter('');
    setProjectIdFilter('');
    setPlatformFilter('all');
    setActionFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
    setCurrentPage(1);
    fetchImpressions();
  }

  function exportToCSV() {
    if (filteredAndSortedImpressions.length === 0) return;

    const headers = ['Date', 'Campaign ID', 'Product ID', 'Project ID', 'Platform', 'Action', 'Device ID', 'Variant', 'Session ID'];
    const rows = filteredAndSortedImpressions.map((i) => [
      i.createdAt?.toDate().toISOString() || '',
      i.campaignId || '',
      i.productId || '',
      i.projectId || '',
      i.platform || '',
      i.action || '',
      i.deviceId || '',
      i.variant || '',
      i.sessionId || '',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impressions-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent('admin_impressions_export', { count: filteredAndSortedImpressions.length });
  }

  function truncateId(id: string, length = 12): string {
    if (!id) return '-';
    return id.length > length ? `${id.slice(0, length)}...` : id;
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
              <span className="text-white">Impressions</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <Eye className="h-8 w-8" />
                  Impressions Data
                </h1>
                <p className="text-violet-200 mt-1">View and filter raw impression records.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  className="bg-white text-violet-700 hover:bg-violet-50"
                  onClick={exportToCSV}
                  disabled={filteredAndSortedImpressions.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Error */}
        {error && (
          <Alert variant="danger" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-surface-500" />
              <span className="text-sm font-medium text-surface-700">Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              <Input
                placeholder="Campaign ID"
                value={campaignIdFilter}
                onChange={(e) => setCampaignIdFilter(e.target.value)}
              />
              <Input
                placeholder="Product ID"
                value={productIdFilter}
                onChange={(e) => setProductIdFilter(e.target.value)}
              />
              <Input
                placeholder="Project ID"
                value={projectIdFilter}
                onChange={(e) => setProjectIdFilter(e.target.value)}
              />
              <SelectRoot value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="extension">Extension</SelectItem>
                </SelectContent>
              </SelectRoot>
              <SelectRoot value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="impression">Impression</SelectItem>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="close">Close</SelectItem>
                </SelectContent>
              </SelectRoot>
              <Input
                type="date"
                placeholder="Start Date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button variant="secondary" size="sm" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <span className="text-sm text-surface-500 ml-auto">
                Showing {filteredAndSortedImpressions.length.toLocaleString()} records
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : paginatedImpressions.length === 0 ? (
              <div className="py-16 text-center">
                <Eye className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No impressions found</p>
                <p className="text-surface-400 text-sm mt-1">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          <SortIcon field="createdAt" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('campaignId')}
                      >
                        <div className="flex items-center gap-1">
                          Campaign ID
                          <SortIcon field="campaignId" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('productId')}
                      >
                        <div className="flex items-center gap-1">
                          Product ID
                          <SortIcon field="productId" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('projectId')}
                      >
                        <div className="flex items-center gap-1">
                          Project ID
                          <SortIcon field="projectId" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('platform')}
                      >
                        <div className="flex items-center gap-1">
                          Platform
                          <SortIcon field="platform" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-surface-50"
                        onClick={() => handleSort('action')}
                      >
                        <div className="flex items-center gap-1">
                          Action
                          <SortIcon field="action" sortField={sortField} sortDirection={sortDirection} />
                        </div>
                      </TableHead>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Session ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedImpressions.map((impression) => (
                      <TableRow key={impression.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-surface-900">
                              {impression.createdAt ? formatDate(impression.createdAt.toDate()) : '-'}
                            </span>
                            <span className="text-xs text-surface-500">
                              {impression.createdAt ? formatRelativeTime(impression.createdAt.toDate()) : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-surface-600" title={impression.campaignId}>
                            {truncateId(impression.campaignId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-surface-600" title={impression.productId}>
                            {truncateId(impression.productId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-surface-600" title={impression.projectId}>
                            {truncateId(impression.projectId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={PLATFORM_BADGE_MAP[impression.platform] || 'default'}
                            size="sm"
                          >
                            {impression.platform || 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={ACTION_BADGE_MAP[impression.action] || 'default'}
                            size="sm"
                          >
                            {impression.action || 'unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-surface-500" title={impression.deviceId}>
                            {truncateId(impression.deviceId, 10)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-surface-600">{impression.variant || '-'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-surface-500" title={impression.sessionId}>
                            {truncateId(impression.sessionId, 10)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-surface-200 px-4 py-3">
                <div className="text-sm text-surface-500">
                  Page {currentPage} of {totalPages} ({filteredAndSortedImpressions.length.toLocaleString()} total)
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="min-w-[32px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
