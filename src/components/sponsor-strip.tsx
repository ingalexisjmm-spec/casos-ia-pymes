import type { SponsorListing } from "@/lib/types";

export function SponsorStrip({ sponsors }: { sponsors: SponsorListing[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="shell pb-4" aria-labelledby="patrocinadores-titulo">
      <h2 id="patrocinadores-titulo">Patrocinadores</h2>
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {sponsors.map((sponsor) => (
          <li key={sponsor.id} className="py-3">
            {sponsor.websiteUrl ? (
              <a href={sponsor.websiteUrl} className="font-semibold hover:text-accent-ink" rel="noopener noreferrer">
                {sponsor.name}
              </a>
            ) : (
              <p className="font-semibold">{sponsor.name}</p>
            )}
            <p className="mt-1 text-sm leading-5 text-muted">{sponsor.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
