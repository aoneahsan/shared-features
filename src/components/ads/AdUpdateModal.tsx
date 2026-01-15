/**
 * AdUpdateModal Component
 *
 * Big slider modal shown when the app updates.
 * Displays a carousel of promotional campaigns with 5 large variants.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { Box, Flex, Text, Button, Dialog, IconButton } from '@radix-ui/themes';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCampaigns, useUpdateAdModal } from '../../hooks/useCampaigns';
import { getLargePanelVariant } from './variants/LargePanelVariants';
import type { AdPlacement } from '../../types/campaigns';

export interface AdUpdateModalProps {
  /** Ad placement (defaults to update_modal) */
  placement?: AdPlacement;
  /** Maximum number of campaigns to show */
  maxCampaigns?: number;
  /** Auto-advance interval in ms (0 to disable) */
  autoAdvanceInterval?: number;
  /** Callback when modal closes */
  onClose?: () => void;
}

/**
 * AdUpdateModal - Big slider promotional modal
 *
 * @example
 * ```tsx
 * <AdUpdateModal />
 * <AdUpdateModal
 *   placement="update_modal"
 *   maxCampaigns={5}
 *   autoAdvanceInterval={5000}
 * />
 * ```
 */
export function AdUpdateModal({
  placement = 'update_modal',
  maxCampaigns = 5,
  autoAdvanceInterval = 5000,
  onClose,
}: AdUpdateModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const trackedImpressions = useRef<Set<string>>(new Set());

  const { shouldShow, currentVersion, markAsShown } = useUpdateAdModal();

  const {
    campaigns,
    loading,
    recordImpression,
    recordClick,
    recordClose,
  } = useCampaigns({ placement, maxCampaigns });

  // Track impression for current campaign
  useEffect(() => {
    if (shouldShow && campaigns.length > 0 && currentIndex < campaigns.length) {
      const campaign = campaigns[currentIndex];
      if (campaign && !trackedImpressions.current.has(campaign.id)) {
        trackedImpressions.current.add(campaign.id);
        recordImpression(campaign);
      }
    }
  }, [shouldShow, campaigns, currentIndex, recordImpression]);

  // Auto-advance carousel
  useEffect(() => {
    if (!shouldShow || campaigns.length <= 1 || autoAdvanceInterval <= 0) return;

    autoAdvanceRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, autoAdvanceInterval);

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
      }
    };
  }, [shouldShow, campaigns.length, autoAdvanceInterval]);

  // Reset auto-advance on manual navigation
  const resetAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearInterval(autoAdvanceRef.current);
    }
    if (autoAdvanceInterval > 0 && campaigns.length > 1) {
      autoAdvanceRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
      }, autoAdvanceInterval);
    }
  }, [autoAdvanceInterval, campaigns.length]);

  // Navigate to previous slide
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    resetAutoAdvance();
  }, [campaigns.length, resetAutoAdvance]);

  // Navigate to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    resetAutoAdvance();
  }, [campaigns.length, resetAutoAdvance]);

  // Navigate to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      resetAutoAdvance();
    },
    [resetAutoAdvance]
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!shouldShow) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, goToPrevious, goToNext]);

  // Handle CTA click
  const handleCTAClick = useCallback(() => {
    const campaign = campaigns[currentIndex];
    if (!campaign) return;
    recordClick(campaign);
  }, [campaigns, currentIndex, recordClick]);

  // Handle close
  const handleClose = useCallback(() => {
    campaigns.forEach((campaign) => {
      recordClose(campaign);
    });
    markAsShown();
    onClose?.();
  }, [campaigns, recordClose, markAsShown, onClose]);

  // Don't show if not eligible or loading
  if (!shouldShow || loading || campaigns.length === 0) {
    return null;
  }

  const currentCampaign = campaigns[currentIndex];
  if (!currentCampaign) return null;

  const variantName = currentCampaign.variant || 'large_slider_1';
  const VariantComponent = getLargePanelVariant(variantName);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Content
        style={{
          maxWidth: 550,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          p="3"
          style={{
            borderBottom: '1px solid var(--gray-a5)',
          }}
        >
          <Text size="2" color="gray">
            What&apos;s New in v{currentVersion}
          </Text>
          <Dialog.Close>
            <IconButton variant="ghost" size="1" color="gray">
              <X size={16} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        {/* Slider Content */}
        <Box style={{ position: 'relative', minHeight: 350 }}>
          <VariantComponent
            campaign={currentCampaign}
            onCTAClick={handleCTAClick}
            showIndicator={campaigns.length > 1}
            currentIndex={currentIndex}
            totalCount={campaigns.length}
          />

          {/* Navigation Arrows */}
          {campaigns.length > 1 && (
            <>
              <IconButton
                variant="soft"
                size="2"
                style={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0.8,
                }}
                onClick={goToPrevious}
              >
                <ChevronLeft size={20} />
              </IconButton>
              <IconButton
                variant="soft"
                size="2"
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0.8,
                }}
                onClick={goToNext}
              >
                <ChevronRight size={20} />
              </IconButton>
            </>
          )}
        </Box>

        {/* Footer with Dots */}
        {campaigns.length > 1 && (
          <Flex
            align="center"
            justify="center"
            gap="2"
            p="3"
            style={{
              borderTop: '1px solid var(--gray-a5)',
            }}
          >
            {campaigns.map((_, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    index === currentIndex ? 'var(--accent-9)' : 'var(--gray-a6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Flex>
        )}

        {/* Skip All Button */}
        <Flex justify="center" pb="3">
          <Button variant="ghost" size="1" color="gray" onClick={handleClose}>
            Skip All
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AdUpdateModal;
