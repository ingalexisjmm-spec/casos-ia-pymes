"use client";

import { useState } from "react";

export function UnsubscribeForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/newsletter/baja", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "No pudimos actualizar la lista.");
    } catch {
      setMessage("No pudimos conectar. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return <p className="mt-6 text-sm text-clay">Falta el enlace de baja. Ábrelo desde el correo.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <button
        type="submit"
        disabled={pending}
        className="bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
      >
        {pending ? "Actualizando…" : "Confirmar baja"}
      </button>
      {message ? (
        <p role="status" className="mt-4 text-sm">
          {message}
        </p>
      ) : null}
    </form>
  );
}
