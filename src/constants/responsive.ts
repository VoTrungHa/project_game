const MAX_WIDTH_DESKTOP: number = 1920;
const MAX_WIDTH_TABLET: number = 991;
const MAX_WIDTH_MOBILE: number = 767;

export default {
  MAX_WIDTH_DESKTOP,
  MAX_WIDTH_TABLET,
  MAX_WIDTH_MOBILE,
  minDesktop: `@media screen and (min-width: ${MAX_WIDTH_TABLET + 1}px)`,
  minTablet: `@media screen and (min-width: ${MAX_WIDTH_MOBILE + 1}px)`,
  maxMobile: `@media (max-width: ${MAX_WIDTH_MOBILE}px)`,
};
