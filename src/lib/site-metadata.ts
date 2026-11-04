// Shared by the root layout and the standalone /resume document, which renders
// outside the App Router layout and writes its own <head>.
import shareImage from '@/data/site-share-image.json';

export const SITE_URL = "https://joshcolecreative.com";

export const SITE_DESCRIPTION =
  "Creative technologist and AI systems designer building usable systems, products, and brands.";

export const SITE_OG_IMAGE = {
  url: `${SITE_URL}${shareImage.path}`,
  type: shareImage.type,
  width: shareImage.width,
  height: shareImage.height,
  alt: shareImage.alt,
};
