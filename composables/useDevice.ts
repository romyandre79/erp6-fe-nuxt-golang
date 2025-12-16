import { useBreakpoints, useWindowSize } from '@vueuse/core';
import { computed } from 'vue';

/**
 * Device detection composable
 * Detects mobile, tablet, and desktop devices based on screen width
 */
export const useDevice = () => {
  // Define breakpoints (in pixels)
  const breakpoints = useBreakpoints({
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
    ultrawide: 1920,
  });

  // Get window size reactively
  const { width, height } = useWindowSize();

  // Device type detection
  const isMobile = computed(() => width.value < 768);
  const isTablet = computed(() => width.value >= 768 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);
  const isWide = computed(() => width.value >= 1280);
  const isUltrawide = computed(() => width.value >= 1920);

  // Orientation detection
  const isPortrait = computed(() => height.value > width.value);
  const isLandscape = computed(() => width.value > height.value);

  // Device type as string
  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile';
    if (isTablet.value) return 'tablet';
    return 'desktop';
  });

  // Screen size category
  const screenSize = computed(() => {
    if (isUltrawide.value) return 'ultrawide';
    if (isWide.value) return 'wide';
    if (isDesktop.value) return 'desktop';
    if (isTablet.value) return 'tablet';
    return 'mobile';
  });

  // Breakpoint helpers from VueUse
  const greaterOrEqual = breakpoints.greaterOrEqual;
  const smaller = breakpoints.smaller;
  const between = breakpoints.between;

  // Touch device detection (best effort)
  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  return {
    // Dimensions
    width,
    height,

    // Device types
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isUltrawide,

    // Orientation
    isPortrait,
    isLandscape,

    // Computed values
    deviceType,
    screenSize,

    // Touch detection
    isTouchDevice,

    // VueUse breakpoint helpers
    greaterOrEqual,
    smaller,
    between,
  };
};
