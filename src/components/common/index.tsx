/**
 * Common Features Components
 *
 * Reusable UI components for displaying common features.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import React from 'react';
import { Box, Text, Flex, Link, Card, Avatar, Badge, Grid, Separator } from '@radix-ui/themes';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Star,
  Briefcase,
  Code,
} from 'lucide-react';
import {
  useContactInfo,
  useDeveloperInfo,
  useSocialLinks,
  useAddressInfo,
  useSkills,
  useTestimonials,
  useServices,
  useProjects,
} from '../../hooks/useCommonFeatures';
import type {
  ContactInfo,
  DeveloperInfo,
  SocialLink,
  AddressInfo,
  Skill,
  Testimonial,
  Service,
  Project,
  SocialPlatform,
} from '../../types/commonFeatures';

// ============================================================================
// ICONS
// ============================================================================

const socialIcons: Record<SocialPlatform, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  facebook: <Globe size={18} />,
  instagram: <Globe size={18} />,
  youtube: <Globe size={18} />,
  tiktok: <Globe size={18} />,
  discord: <MessageCircle size={18} />,
  telegram: <MessageCircle size={18} />,
  whatsapp: <MessageCircle size={18} />,
  medium: <Globe size={18} />,
  devto: <Code size={18} />,
  stackoverflow: <Code size={18} />,
  dribbble: <Globe size={18} />,
  behance: <Globe size={18} />,
  codepen: <Code size={18} />,
  npm: <Code size={18} />,
  website: <Globe size={18} />,
  email: <Mail size={18} />,
  other: <ExternalLink size={18} />,
};

// ============================================================================
// CONTACT CARD
// ============================================================================

interface ContactCardProps {
  data?: ContactInfo | null;
  compact?: boolean;
  showFreelance?: boolean;
}

export function ContactCard({ data: propData, compact = false, showFreelance = true }: ContactCardProps) {
  const { data: hookData, loading } = useContactInfo({ autoFetch: !propData });
  const data = propData ?? hookData;

  if (loading) return <ContactCardSkeleton />;
  if (!data) return null;

  return (
    <Card size={compact ? '1' : '2'}>
      <Flex direction="column" gap="3">
        <Text size="3" weight="bold">Contact</Text>

        {showFreelance && data.freelanceAvailable && (
          <Badge color="green" size="1">Available for Freelance</Badge>
        )}

        <Flex direction="column" gap="2">
          {data.email && (
            <Link href={`mailto:${data.email}`} size="2">
              <Flex align="center" gap="2">
                <Mail size={16} />
                <Text>{data.email}</Text>
              </Flex>
            </Link>
          )}

          {data.phone && (
            <Link href={`tel:${data.phone}`} size="2">
              <Flex align="center" gap="2">
                <Phone size={16} />
                <Text>{data.phone}</Text>
              </Flex>
            </Link>
          )}

          {data.whatsapp && (
            <Link href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} target="_blank" size="2">
              <Flex align="center" gap="2">
                <MessageCircle size={16} />
                <Text>WhatsApp</Text>
              </Flex>
            </Link>
          )}
        </Flex>

        {!compact && data.workingHours && (
          <>
            <Separator size="4" />
            <Text size="1" color="gray">{data.workingHours}</Text>
          </>
        )}
      </Flex>
    </Card>
  );
}

function ContactCardSkeleton() {
  return (
    <Card>
      <Flex direction="column" gap="3">
        <Box style={{ height: 20, width: 80, background: 'var(--gray-4)', borderRadius: 4 }} />
        <Box style={{ height: 16, width: 180, background: 'var(--gray-3)', borderRadius: 4 }} />
        <Box style={{ height: 16, width: 120, background: 'var(--gray-3)', borderRadius: 4 }} />
      </Flex>
    </Card>
  );
}

// ============================================================================
// DEVELOPER CARD
// ============================================================================

interface DeveloperCardProps {
  data?: DeveloperInfo | null;
  compact?: boolean;
  showBio?: boolean;
}

export function DeveloperCard({ data: propData, compact = false, showBio = true }: DeveloperCardProps) {
  const { data: hookData, loading } = useDeveloperInfo({ autoFetch: !propData });
  const data = propData ?? hookData;

  if (loading) return <DeveloperCardSkeleton />;
  if (!data) return null;

  return (
    <Card size={compact ? '1' : '2'}>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="3">
          {data.avatar && (
            <Avatar src={data.avatar} fallback={data.name?.[0] || '?'} size="4" radius="full" />
          )}
          <Box>
            <Text size="4" weight="bold">{data.name}</Text>
            <Text size="2" color="gray">{data.title}</Text>
          </Box>
        </Flex>

        {data.availableForHire && (
          <Badge color="green" size="1">Available for Hire</Badge>
        )}

        {showBio && !compact && data.bio && (
          <Text size="2" color="gray">{data.shortBio || data.bio}</Text>
        )}

        <Flex gap="2" wrap="wrap">
          {data.website && (
            <Link href={data.website} target="_blank" size="1">
              <Flex align="center" gap="1">
                <Globe size={14} />
                Website
              </Flex>
            </Link>
          )}
          {data.github && (
            <Link href={data.github} target="_blank" size="1">
              <Flex align="center" gap="1">
                <Github size={14} />
                GitHub
              </Flex>
            </Link>
          )}
          {data.linkedin && (
            <Link href={data.linkedin} target="_blank" size="1">
              <Flex align="center" gap="1">
                <Linkedin size={14} />
                LinkedIn
              </Flex>
            </Link>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

function DeveloperCardSkeleton() {
  return (
    <Card>
      <Flex align="center" gap="3">
        <Box style={{ height: 48, width: 48, background: 'var(--gray-4)', borderRadius: '50%' }} />
        <Box>
          <Box style={{ height: 20, width: 120, background: 'var(--gray-4)', borderRadius: 4, marginBottom: 4 }} />
          <Box style={{ height: 16, width: 80, background: 'var(--gray-3)', borderRadius: 4 }} />
        </Box>
      </Flex>
    </Card>
  );
}

// ============================================================================
// SOCIAL LINKS BAR
// ============================================================================

interface SocialLinksBarProps {
  data?: SocialLink[];
  showIn?: ('footer' | 'contact' | 'about' | 'header')[];
  gap?: '1' | '2' | '3' | '4';
}

export function SocialLinksBar({ data: propData, showIn, gap = '3' }: SocialLinksBarProps) {
  const { data: hookData, loading } = useSocialLinks({ autoFetch: !propData, showIn });
  const data = propData ?? hookData;

  if (loading || data.length === 0) return null;

  return (
    <Flex gap={gap} align="center" wrap="wrap">
      {data.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          target="_blank"
          title={link.displayName || link.platform}
          style={{ color: 'inherit' }}
        >
          {socialIcons[link.platform]}
        </Link>
      ))}
    </Flex>
  );
}

// ============================================================================
// ADDRESS CARD
// ============================================================================

interface AddressCardProps {
  data?: AddressInfo | null;
  compact?: boolean;
}

export function AddressCard({ data: propData, compact = false }: AddressCardProps) {
  const { data: hookData, loading } = useAddressInfo({ autoFetch: !propData });
  const data = propData ?? hookData;

  if (loading || !data) return null;

  const address = data.fullAddress || [data.streetAddress, data.city, data.state, data.country].filter(Boolean).join(', ');

  return (
    <Card size={compact ? '1' : '2'}>
      <Flex align="start" gap="2">
        <MapPin size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <Box>
          {data.label && <Text size="2" weight="bold">{data.label}</Text>}
          <Text size="2" color="gray">{address}</Text>
          {data.googleMapsUrl && (
            <Link href={data.googleMapsUrl} target="_blank" size="1">
              View on Maps
            </Link>
          )}
        </Box>
      </Flex>
    </Card>
  );
}

// ============================================================================
// SKILLS DISPLAY
// ============================================================================

interface SkillsDisplayProps {
  data?: Skill[];
  featuredOnly?: boolean;
  showLevel?: boolean;
  maxItems?: number;
}

export function SkillsDisplay({ data: propData, featuredOnly = false, showLevel = true, maxItems }: SkillsDisplayProps) {
  const { data: hookData, loading } = useSkills({ autoFetch: !propData, featuredOnly });
  let data = propData ?? hookData;

  if (maxItems && data.length > maxItems) {
    data = data.slice(0, maxItems);
  }

  if (loading || data.length === 0) return null;

  const levelColors: Record<string, 'gray' | 'blue' | 'green' | 'orange'> = {
    beginner: 'gray',
    intermediate: 'blue',
    advanced: 'green',
    expert: 'orange',
  };

  return (
    <Flex gap="2" wrap="wrap">
      {data.map((skill) => (
        <Badge key={skill.id} color={showLevel ? levelColors[skill.level] : undefined} size="2">
          {skill.name}
        </Badge>
      ))}
    </Flex>
  );
}

// ============================================================================
// TESTIMONIALS CAROUSEL (Simple Grid)
// ============================================================================

interface TestimonialsGridProps {
  data?: Testimonial[];
  featuredOnly?: boolean;
  maxItems?: number;
  columns?: '1' | '2' | '3';
}

export function TestimonialsGrid({ data: propData, featuredOnly = false, maxItems, columns = '2' }: TestimonialsGridProps) {
  const { data: hookData, loading } = useTestimonials({ autoFetch: !propData, featuredOnly, limit: maxItems });
  const data = propData ?? hookData;

  if (loading || data.length === 0) return null;

  return (
    <Grid columns={columns} gap="4">
      {data.map((testimonial) => (
        <Card key={testimonial.id}>
          <Flex direction="column" gap="3">
            {testimonial.rating && (
              <Flex gap="1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="var(--amber-9)" color="var(--amber-9)" />
                ))}
              </Flex>
            )}

            <Text size="2" style={{ fontStyle: 'italic' }}>
              "{testimonial.shortContent || testimonial.content}"
            </Text>

            <Flex align="center" gap="2">
              {testimonial.authorAvatar && (
                <Avatar src={testimonial.authorAvatar} fallback={testimonial.authorName?.[0] || '?'} size="2" radius="full" />
              )}
              <Box>
                <Text size="2" weight="bold">{testimonial.authorName}</Text>
                {(testimonial.authorTitle || testimonial.authorCompany) && (
                  <Text size="1" color="gray">
                    {[testimonial.authorTitle, testimonial.authorCompany].filter(Boolean).join(' at ')}
                  </Text>
                )}
              </Box>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}

// ============================================================================
// SERVICES GRID
// ============================================================================

interface ServicesGridProps {
  data?: Service[];
  featuredOnly?: boolean;
  maxItems?: number;
  columns?: '1' | '2' | '3';
}

export function ServicesGrid({ data: propData, featuredOnly = false, maxItems, columns = '3' }: ServicesGridProps) {
  const { data: hookData, loading } = useServices({ autoFetch: !propData, featuredOnly });
  let data = propData ?? hookData;

  if (maxItems && data.length > maxItems) {
    data = data.slice(0, maxItems);
  }

  if (loading || data.length === 0) return null;

  return (
    <Grid columns={columns} gap="4">
      {data.map((service) => (
        <Card key={service.id}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Briefcase size={18} />
              <Text size="3" weight="bold">{service.title}</Text>
            </Flex>

            <Text size="2" color="gray">
              {service.shortDescription || service.description}
            </Text>

            {service.technologies && service.technologies.length > 0 && (
              <Flex gap="1" wrap="wrap">
                {service.technologies.slice(0, 5).map((tech, i) => (
                  <Badge key={i} size="1" color="gray">{tech}</Badge>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}

// ============================================================================
// PROJECTS GRID
// ============================================================================

interface ProjectsGridProps {
  data?: Project[];
  featuredOnly?: boolean;
  maxItems?: number;
  columns?: '1' | '2' | '3';
}

export function ProjectsGrid({ data: propData, featuredOnly = false, maxItems, columns = '3' }: ProjectsGridProps) {
  const { data: hookData, loading } = useProjects({ autoFetch: !propData, featuredOnly });
  let data = propData ?? hookData;

  if (maxItems && data.length > maxItems) {
    data = data.slice(0, maxItems);
  }

  if (loading || data.length === 0) return null;

  return (
    <Grid columns={columns} gap="4">
      {data.map((project) => (
        <Card key={project.id}>
          <Flex direction="column" gap="2">
            {project.thumbnailUrl && (
              <Box
                style={{
                  height: 140,
                  borderRadius: 'var(--radius-2)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            <Flex align="center" gap="2">
              <Code size={18} />
              <Text size="3" weight="bold">{project.title}</Text>
            </Flex>

            <Text size="2" color="gray">
              {project.shortDescription || project.description}
            </Text>

            {project.technologies && project.technologies.length > 0 && (
              <Flex gap="1" wrap="wrap">
                {project.technologies.slice(0, 5).map((tech, i) => (
                  <Badge key={i} size="1" color="gray">{tech}</Badge>
                ))}
              </Flex>
            )}

            {project.links && project.links.length > 0 && (
              <Flex gap="2" mt="2">
                {project.links.map((link, i) => (
                  <Link key={i} href={link.url} target="_blank" size="1">
                    {link.label || link.type}
                  </Link>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}

// ============================================================================
// COMBINED FOOTER SECTION
// ============================================================================

interface FooterSectionProps {
  showContact?: boolean;
  showSocialLinks?: boolean;
  showAddress?: boolean;
}

export function FooterSection({ showContact = true, showSocialLinks = true, showAddress = false }: FooterSectionProps) {
  return (
    <Flex direction="column" gap="4" align="center">
      {showSocialLinks && <SocialLinksBar showIn={['footer']} />}

      <Flex gap="4" wrap="wrap" justify="center">
        {showContact && <ContactCard compact />}
        {showAddress && <AddressCard compact />}
      </Flex>
    </Flex>
  );
}
