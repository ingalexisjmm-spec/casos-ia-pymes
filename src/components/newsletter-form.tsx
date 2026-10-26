"use client";

import { useState } from "react";

type Status = { kind: "idle" | "loading" | "ok" | "error"; text: string };

export function NewsletterForm({ source }: { source: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "loading", text: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          company_website: String(data.get("company_website") ?? ""),
          source,
        }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus({ kind: "error", text: payload.error ?? "No pudimos guardar el correo." });
        return;
      }
      form.reset();
      setStatus({ kind: "ok", text: payload.message ?? "Listo. Guardamos tu correo." });
    } catch {
      setStatus({ kind: "error", text: "No pudimos conectar. Inténtalo de nuevo." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-2">
      <label htmlFor={`email-${source}`} className="label">
        correo
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="tu@correo.com"
          className="field"
        />
        <button type="submit" disabled={status.kind === "loading"} className="btn btn-ink">
          {status.kind === "loading" ? "Enviando…" : "Quiero recibirlas"}
        </button>
      </div>
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Sitio de la empresa
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status.text ? (
        <p role="status" className={status.kind === "error" ? "text-sm text-clay" : "text-sm text-pine-ink"}>
          {status.text}
        </p>
      ) : (
        <p className="text-xs text-muted">Puedes salir de la lista cuando quieras. No compartimos el correo.</p>
      )}
    </form>
  );
}
