import type { SponsorListing } from "@/lib/types";

export function SponsorStrip({ sponsors }: { sponsors: SponsorListing[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="prose-width pb-4" aria-labelledby="patrocinadores-titulo">
      <h2 id="patrocinadores-titulo">Patrocinadores</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {sponsors.map((sponsor) => (
          <li key={sponsor.id} className="border border-line bg-card p-4">
            {sponsor.websiteUrl ? (
              <a href={sponsor.websiteUrl} className="font-semibold hover:text-pine" rel="noopener noreferrer">
                {sponsor.name}
              </a>
            ) : (
              <p className="font-semibold">{sponsor.name}</p>
            )}
            <p className="mt-2 text-sm leading-6 text-muted">{sponsor.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
