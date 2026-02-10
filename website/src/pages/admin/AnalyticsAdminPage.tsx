import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Download,
  Calendar,
  TrendingUp,
  MousePointerClick,
  Percent,
  Megaphone,
  Radio,
  Clock,
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import * as d3 from 'd3';
import { db } from '@/lib/firebase';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
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

interface CampaignDoc {
  id: string;
  name: string;
  status: string;
  frequencyDays: number;
  totalImpressions: number;
  totalClicks: number;
}

interface BroadcastDoc {
  id: string;
  title: string;
  status: string;
  totalImpressions: number;
  totalClicks: number;
}

type DateRange = '7d' | '30d' | '90d' | 'all' | 'custom';

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 rounded bg-surface-100" />
      ))}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-surface-500">{label}</p>
              <p className="text-2xl font-bold text-surface-900">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AnalyticsAdminPage() {
  const { isAdmin } = useAuth();
  const [impressions, setImpressions] = useState<ImpressionDoc[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignDoc[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Chart refs
  const impressionsOverTimeRef = useRef<SVGSVGElement>(null);
  const clicksVsImpressionsRef = useRef<SVGSVGElement>(null);
  const platformDistributionRef = useRef<SVGSVGElement>(null);
  const topCampaignsRef = useRef<SVGSVGElement>(null);
  const projectDistributionRef = useRef<SVGSVGElement>(null);
  const broadcastPerformanceRef = useRef<SVGSVGElement>(null);

  const getDateRangeFilter = useCallback(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        if (customStart) {
          startDate = new Date(customStart);
        } else {
          startDate = new Date(0);
        }
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    const endDate = dateRange === 'custom' && customEnd ? new Date(customEnd) : now;
    return { startDate, endDate };
  }, [dateRange, customStart, customEnd]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const { startDate, endDate } = getDateRangeFilter();

      // Fetch impressions with date filter
      let impressionsQuery;
      if (dateRange === 'all') {
        impressionsQuery = query(
          collection(db, 'zaions_impressions'),
          orderBy('createdAt', 'desc')
        );
      } else {
        impressionsQuery = query(
          collection(db, 'zaions_impressions'),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('createdAt', '<=', Timestamp.fromDate(endDate)),
          orderBy('createdAt', 'desc')
        );
      }

      const [impressionsSnap, campaignsSnap, broadcastsSnap] = await Promise.all([
        getDocs(impressionsQuery),
        getDocs(query(collection(db, 'zaions_campaigns'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'zaions_broadcasts'), orderBy('createdAt', 'desc'))),
      ]);

      const impressionsData = impressionsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ImpressionDoc[];

      const campaignsData = campaignsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CampaignDoc[];

      const broadcastsData = broadcastsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BroadcastDoc[];

      setImpressions(impressionsData);
      setCampaigns(campaignsData);
      setBroadcasts(broadcastsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dateRange, getDateRangeFilter]);

  useEffect(() => {
    trackPageView('/admin/analytics', 'Analytics Admin');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dateRange !== 'custom') {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // Calculate metrics
  const totalImpressions = impressions.length;
  const totalClicks = impressions.filter((i) => i.action === 'click').length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const activeBroadcasts = broadcasts.filter((b) => b.status === 'active').length;
  const avgFrequency =
    campaigns.length > 0
      ? (campaigns.reduce((sum, c) => sum + (c.frequencyDays || 0), 0) / campaigns.length).toFixed(1)
      : '0';

  // Chart 1: Impressions Over Time
  useEffect(() => {
    if (!impressionsOverTimeRef.current || impressions.length === 0) return;

    const svg = d3.select(impressionsOverTimeRef.current);
    svg.selectAll('*').remove();

    const containerWidth = impressionsOverTimeRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Group by date
    const dailyData = d3.rollup(
      impressions,
      (v) => v.length,
      (d) => d.createdAt?.toDate().toISOString().slice(0, 10)
    );

    const data = Array.from(dailyData, ([date, count]) => ({
      date: new Date(date),
      count,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (data.length === 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8B5CF6').attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#8B5CF6').attr('stop-opacity', 0);

    // Area
    const area = d3
      .area<{ date: Date; count: number }>()
      .x((d) => x(d.date))
      .y0(innerHeight)
      .y1((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path').datum(data).attr('fill', 'url(#areaGradient)').attr('d', area);

    // Line
    const line = d3
      .line<{ date: Date; count: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#8B5CF6')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Dots
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.count))
      .attr('r', 4)
      .attr('fill', '#8B5CF6');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d') as (d: Date | d3.NumberValue) => string))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');
  }, [impressions]);

  // Chart 2: Clicks vs Impressions
  useEffect(() => {
    if (!clicksVsImpressionsRef.current || impressions.length === 0) return;

    const svg = d3.select(clicksVsImpressionsRef.current);
    svg.selectAll('*').remove();

    const containerWidth = clicksVsImpressionsRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const margin = { top: 20, right: 100, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Group by date
    const dailyImpressions = d3.rollup(
      impressions,
      (v) => v.length,
      (d) => d.createdAt?.toDate().toISOString().slice(0, 10)
    );

    const dailyClicks = d3.rollup(
      impressions.filter((i) => i.action === 'click'),
      (v) => v.length,
      (d) => d.createdAt?.toDate().toISOString().slice(0, 10)
    );

    const dates = Array.from(new Set([...dailyImpressions.keys(), ...dailyClicks.keys()])).sort();
    const data = dates.map((date) => ({
      date: new Date(date),
      impressions: dailyImpressions.get(date) || 0,
      clicks: dailyClicks.get(date) || 0,
    }));

    if (data.length === 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const maxVal = d3.max(data, (d) => Math.max(d.impressions, d.clicks)) || 0;
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerHeight, 0]);

    // Impressions line
    const impressionsLine = d3
      .line<{ date: Date; impressions: number; clicks: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.impressions))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#8B5CF6')
      .attr('stroke-width', 2.5)
      .attr('d', impressionsLine);

    // Clicks line
    const clicksLine = d3
      .line<{ date: Date; impressions: number; clicks: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.clicks))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 2.5)
      .attr('d', clicksLine);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d') as (d: Date | d3.NumberValue) => string))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 90}, ${margin.top})`);

    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 12).attr('height', 12).attr('fill', '#8B5CF6');
    legend.append('text').attr('x', 18).attr('y', 10).text('Impressions').attr('fill', '#64748b').attr('font-size', '11px');

    legend.append('rect').attr('x', 0).attr('y', 20).attr('width', 12).attr('height', 12).attr('fill', '#10B981');
    legend.append('text').attr('x', 18).attr('y', 30).text('Clicks').attr('fill', '#64748b').attr('font-size', '11px');
  }, [impressions]);

  // Chart 3: Platform Distribution (Donut)
  useEffect(() => {
    if (!platformDistributionRef.current || impressions.length === 0) return;

    const svg = d3.select(platformDistributionRef.current);
    svg.selectAll('*').remove();

    const containerWidth = platformDistributionRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    const platformCounts = d3.rollup(
      impressions,
      (v) => v.length,
      (d) => d.platform || 'unknown'
    );

    const data = Array.from(platformCounts, ([platform, count]) => ({ platform, count }));

    const colors: Record<string, string> = {
      web: '#8B5CF6',
      android: '#10B981',
      ios: '#F59E0B',
      extension: '#EC4899',
      unknown: '#94A3B8',
    };

    const pie = d3
      .pie<{ platform: string; count: number }>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ platform: string; count: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colors[d.data.platform] || '#94A3B8')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text((d) => (d.data.count > 0 ? d.data.platform : ''));

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 100}, 20)`);

    data.forEach((d, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
      row.append('rect').attr('width', 14).attr('height', 14).attr('rx', 3).attr('fill', colors[d.platform] || '#94A3B8');
      row
        .append('text')
        .attr('x', 20)
        .attr('y', 11)
        .text(`${d.platform} (${d.count})`)
        .attr('fill', '#64748b')
        .attr('font-size', '11px');
    });
  }, [impressions]);

  // Chart 4: Top Campaigns by Impressions (Horizontal Bar)
  useEffect(() => {
    if (!topCampaignsRef.current || impressions.length === 0) return;

    const svg = d3.select(topCampaignsRef.current);
    svg.selectAll('*').remove();

    const containerWidth = topCampaignsRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const campaignCounts = d3.rollup(
      impressions,
      (v) => v.length,
      (d) => d.campaignId || 'unknown'
    );

    const data = Array.from(campaignCounts, ([campaignId, count]) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      return { name: campaign?.name || campaignId.slice(0, 12), count };
    })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (data.length === 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .range([0, innerWidth]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3);

    // Gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8B5CF6');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#A78BFA');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.name) || 0)
      .attr('width', (d) => x(d.count))
      .attr('height', y.bandwidth())
      .attr('fill', 'url(#barGradient)')
      .attr('rx', 4);

    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => x(d.count) + 8)
      .attr('y', (d) => (y(d.name) || 0) + y.bandwidth() / 2 + 4)
      .text((d) => d.count.toLocaleString())
      .attr('fill', '#64748b')
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('fill', '#374151')
      .attr('font-size', '11px');

    g.select('.domain').remove();
  }, [impressions, campaigns]);

  // Chart 5: Project Distribution (Pie)
  useEffect(() => {
    if (!projectDistributionRef.current || impressions.length === 0) return;

    const svg = d3.select(projectDistributionRef.current);
    svg.selectAll('*').remove();

    const containerWidth = projectDistributionRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    const projectCounts = d3.rollup(
      impressions,
      (v) => v.length,
      (d) => d.projectId || 'unknown'
    );

    const data = Array.from(projectCounts, ([projectId, count]) => ({
      projectId: projectId.slice(0, 15),
      count,
    }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.projectId))
      .range(['#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#EF4444']);

    const pie = d3
      .pie<{ projectId: string; count: number }>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ projectId: string; count: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data.projectId))
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text((d) => (d.endAngle - d.startAngle > 0.3 ? d.data.projectId.slice(0, 8) : ''));
  }, [impressions]);

  // Chart 6: Broadcast Performance (Grouped Bar)
  useEffect(() => {
    if (!broadcastPerformanceRef.current || broadcasts.length === 0) return;

    const svg = d3.select(broadcastPerformanceRef.current);
    svg.selectAll('*').remove();

    const containerWidth = broadcastPerformanceRef.current.clientWidth || 400;
    const width = containerWidth;
    const height = 300;
    const margin = { top: 20, right: 100, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = broadcasts.slice(0, 5).map((b) => ({
      name: b.title?.slice(0, 15) || b.id.slice(0, 8),
      impressions: b.totalImpressions || 0,
      clicks: b.totalClicks || 0,
    }));

    if (data.length === 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2);

    const x1 = d3.scaleBand().domain(['impressions', 'clicks']).range([0, x0.bandwidth()]).padding(0.1);

    const maxVal = d3.max(data, (d) => Math.max(d.impressions, d.clicks)) || 0;
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerHeight, 0]);

    const colors = { impressions: '#8B5CF6', clicks: '#10B981' };

    data.forEach((d) => {
      const group = g.append('g').attr('transform', `translate(${x0(d.name)},0)`);

      group
        .append('rect')
        .attr('x', x1('impressions') || 0)
        .attr('y', y(d.impressions))
        .attr('width', x1.bandwidth())
        .attr('height', innerHeight - y(d.impressions))
        .attr('fill', colors.impressions)
        .attr('rx', 3);

      group
        .append('rect')
        .attr('x', x1('clicks') || 0)
        .attr('y', y(d.clicks))
        .attr('width', x1.bandwidth())
        .attr('height', innerHeight - y(d.clicks))
        .attr('fill', colors.clicks)
        .attr('rx', 3);
    });

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('transform', 'rotate(-30)')
      .attr('text-anchor', 'end');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '11px');

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 90}, ${margin.top})`);

    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 12).attr('height', 12).attr('fill', '#8B5CF6');
    legend.append('text').attr('x', 18).attr('y', 10).text('Impressions').attr('fill', '#64748b').attr('font-size', '11px');

    legend.append('rect').attr('x', 0).attr('y', 20).attr('width', 12).attr('height', 12).attr('fill', '#10B981');
    legend.append('text').attr('x', 18).attr('y', 30).text('Clicks').attr('fill', '#64748b').attr('font-size', '11px');
  }, [broadcasts]);

  function exportToCSV() {
    if (impressions.length === 0) return;

    const headers = ['Date', 'Campaign ID', 'Product ID', 'Project ID', 'Platform', 'Action', 'Device ID', 'Variant', 'Session ID'];
    const rows = impressions.map((i) => [
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

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent('admin_analytics_export');
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
              <span className="text-white">Analytics</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="h-8 w-8" />
                  Analytics Dashboard
                </h1>
                <p className="text-violet-200 mt-1">View campaign and broadcast performance metrics.</p>
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
                  disabled={impressions.length === 0}
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

        {/* Date Range Picker */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-surface-500" />
                <span className="text-sm font-medium text-surface-700">Date Range:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                  >
                    {range === '7d' && '7 Days'}
                    {range === '30d' && '30 Days'}
                    {range === '90d' && '90 Days'}
                    {range === 'all' && 'All Time'}
                  </Button>
                ))}
                <Button
                  variant={dateRange === 'custom' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('custom')}
                >
                  Custom
                </Button>
              </div>
              {dateRange === 'custom' && (
                <div className="flex items-center gap-2 ml-auto">
                  <Input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-36"
                  />
                  <span className="text-surface-500">to</span>
                  <Input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-36"
                  />
                  <Button variant="secondary" size="sm" onClick={fetchData}>
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            {/* Metric Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <MetricCard
                icon={TrendingUp}
                label="Total Impressions"
                value={totalImpressions.toLocaleString()}
                color="bg-violet-500"
              />
              <MetricCard
                icon={MousePointerClick}
                label="Total Clicks"
                value={totalClicks.toLocaleString()}
                color="bg-emerald-500"
              />
              <MetricCard icon={Percent} label="Click-Through Rate" value={`${ctr}%`} color="bg-amber-500" />
              <MetricCard
                icon={Megaphone}
                label="Active Campaigns"
                value={activeCampaigns}
                color="bg-blue-500"
              />
              <MetricCard icon={Radio} label="Active Broadcasts" value={activeBroadcasts} color="bg-pink-500" />
              <MetricCard icon={Clock} label="Avg Frequency" value={`${avgFrequency} days`} color="bg-indigo-500" />
            </motion.div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Impressions Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impressions Over Time</CardTitle>
                  <CardDescription>Daily impression trend for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  {impressions.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No data available
                    </div>
                  ) : (
                    <svg ref={impressionsOverTimeRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>

              {/* Chart 2: Clicks vs Impressions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clicks vs Impressions</CardTitle>
                  <CardDescription>Comparison of clicks and impressions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {impressions.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No data available
                    </div>
                  ) : (
                    <svg ref={clicksVsImpressionsRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>

              {/* Chart 3: Platform Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Distribution</CardTitle>
                  <CardDescription>Impressions by platform (web, android, ios, extension)</CardDescription>
                </CardHeader>
                <CardContent>
                  {impressions.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No data available
                    </div>
                  ) : (
                    <svg ref={platformDistributionRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>

              {/* Chart 4: Top Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Campaigns by Impressions</CardTitle>
                  <CardDescription>Top 5 campaigns ranked by total impressions</CardDescription>
                </CardHeader>
                <CardContent>
                  {impressions.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No data available
                    </div>
                  ) : (
                    <svg ref={topCampaignsRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>

              {/* Chart 5: Project Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Distribution</CardTitle>
                  <CardDescription>Which consumer projects generate the most impressions</CardDescription>
                </CardHeader>
                <CardContent>
                  {impressions.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No data available
                    </div>
                  ) : (
                    <svg ref={projectDistributionRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>

              {/* Chart 6: Broadcast Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Broadcast Performance</CardTitle>
                  <CardDescription>Impressions and clicks for recent broadcasts</CardDescription>
                </CardHeader>
                <CardContent>
                  {broadcasts.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-surface-400">
                      No broadcast data available
                    </div>
                  ) : (
                    <svg ref={broadcastPerformanceRef} className="w-full h-[300px]" />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
