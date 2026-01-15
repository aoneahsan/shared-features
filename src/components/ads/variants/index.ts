/**
 * Variant Components Index
 *
 * Re-exports all variant components for the shared-features package.
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

// Small Panel Variants (5)
export {
  MinimalVariant,
  TaglineVariant,
  FeaturesVariant,
  GradientVariant,
  CardVariant,
  SMALL_PANEL_VARIANTS,
  getSmallPanelVariant,
} from './SmallPanelVariants';
export type { SmallPanelVariantName } from './SmallPanelVariants';

// Large Panel Variants (5)
export {
  HeroVariant,
  FeatureGridVariant,
  TestimonialVariant,
  ComparisonVariant,
  VideoVariant,
  LARGE_PANEL_VARIANTS,
  getLargePanelVariant,
} from './LargePanelVariants';
export type { LargePanelVariantName } from './LargePanelVariants';
