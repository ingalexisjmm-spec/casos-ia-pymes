import type { UseCase } from "@/lib/types";

/** Misma imagen que genera `src/app/opengraph-image.tsx` y que ya usa /privacidad. */
export const SHARE_IMAGE_PATH = "/opengraph-image";

export const SHARE_IMAGE_ALT = "Casos IA: usos de inteligencia artificial para negocios";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const SHARE_IMAGE_TYPE = "image/png";

export type ShareImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
};

const defaultShareImage: ShareImage = {
  url: SHARE_IMAGE_PATH,
  width: SHARE_IMAGE_SIZE.width,
  height: SHARE_IMAGE_SIZE.height,
  alt: SHARE_IMAGE_ALT,
  type: SHARE_IMAGE_TYPE,
};

/** Usa la imagen de la ficha si ya existe. Si no, la imagen de compartir del sitio. */
export function shareImageFor(item: Pick<UseCase, "title" | "shareImageUrl">): ShareImage {
  const custom = item.shareImageUrl?.trim();
  if (!custom) return defaultShareImage;
  return {
    url: custom,
    width: SHARE_IMAGE_SIZE.width,
    height: SHARE_IMAGE_SIZE.height,
    alt: item.title,
  };
}
