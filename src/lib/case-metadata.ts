import type { Metadata } from "next";

import { shareImageFor } from "@/lib/share-image";
import type { UseCase } from "@/lib/types";

/** Título y descripción de Open Graph y de Twitter salen del mismo texto de la ficha. */
export function buildCaseMetadata(item: UseCase): Metadata {
  const title = item.title;
  const description = item.summary;
  const image = shareImageFor(item);
  return {
    title,
    description,
    alternates: { canonical: `/casos/${item.slug}` },
    openGraph: {
      title,
      description,
      url: `/casos/${item.slug}`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
