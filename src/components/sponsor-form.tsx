"use client";

import { useState } from "react";

import { SPONSOR_PRICE_USD } from "@/lib/site";

type Status = { kind: "idle" | "loading" | "error"; text: string };

export function SponsorForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "loading", text: "" });

    try {
      const response = await fetch("/api/patrocinio/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          website: String(data.get("website") ?? ""),
          blurb: String(data.get("blurb") ?? ""),
          company_website: String(data.get("company_website") ?? ""),
        }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setStatus({ kind: "error", text: payload.error ?? "No pudimos abrir el pago." });
        return;
      }
      window.location.assign(payload.url);
    } catch {
      setStatus({ kind: "error", text: "No pudimos conectar. Inténtalo de nuevo." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="plate relative">
      <div>
        <label htmlFor="sponsor-name" className="label">
          nombre del negocio o producto
        </label>
        <input id="sponsor-name" name="name" required maxLength={80} autoComplete="organization" className="field mt-2" />
      </div>
      <div>
        <label htmlFor="sponsor-email" className="label">
          correo
        </label>
        <input
          id="sponsor-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          className="field mt-2"
        />
      </div>
      <div>
        <label htmlFor="sponsor-website" className="label">
          sitio web <span className="font-normal">(opcional)</span>
        </label>
        <input
          id="sponsor-website"
          name="website"
          type="url"
          inputMode="url"
          placeholder="https://"
          maxLength={300}
          className="field mt-2"
        />
      </div>
      <div>
        <label htmlFor="sponsor-blurb" className="label">
          frase para la ficha
        </label>
        <textarea
          id="sponsor-blurb"
          name="blurb"
          required
          maxLength={160}
          rows={3}
          placeholder="Una línea sobre qué haces. Máximo 160 caracteres."
          className="field mt-2"
        />
      </div>
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Sitio de la empresa
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={status.kind === "loading"}
        className="btn btn-olive"
      >
        {status.kind === "loading" ? "Abriendo Stripe…" : `Pagar USD ${SPONSOR_PRICE_USD} con Stripe`}
      </button>
      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-clay">
          {status.text}
        </p>
      ) : (
        <p className="text-xs leading-5 text-muted">
          El pago lo procesa Stripe. Publicamos la ficha cuando el pago queda confirmado. No guardamos datos de la tarjeta.
        </p>
      )}
    </form>
  );
}
