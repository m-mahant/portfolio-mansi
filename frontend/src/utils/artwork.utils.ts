import { Artwork } from '@/types/public.types';
import { LightboxImageItem } from '@/components/public/art-crafts/artwork-lightbox';

// Builds the de-duplicated, lightbox-ready image list (featured cover first) shared by the hero and gallery.
export function getArtworkLightboxImages(artwork: Artwork): LightboxImageItem[] {
  const list: LightboxImageItem[] = [];

  if (artwork.featuredImage?.url) {
    list.push({
      url: artwork.featuredImage.url,
      altText: artwork.featuredImage.altText || `${artwork.title} Cover`,
      caption: artwork.featuredImage.caption || `${artwork.title} (Featured Cover)`,
    });
  }

  if (artwork.images && artwork.images.length > 0) {
    artwork.images.forEach((img) => {
      if (!list.some((item) => item.url === img.url)) {
        list.push({
          url: img.url,
          altText: img.altText || artwork.title,
          caption: img.caption,
        });
      }
    });
  }

  return list;
}
