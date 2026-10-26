import "server-only";

import { Resend } from "resend";

import { absoluteUrl, SITE_NAME, SPONSOR_LAUNCH_PRICE_USD } from "@/lib/site";

export function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function resendFrom(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  return from || null;
}

export async function sendNewsletterWelcome(email: string, unsubscribeToken: string): Promise<boolean> {
  const resend = resendClient();
  const from = resendFrom();
  if (!resend || !from) return false;

  const unsubscribeUrl = absoluteUrl(`/baja?token=${unsubscribeToken}`);
  const text = [
    "Quedaste en la lista de Casos IA.",
    "",
    "De vez en cuando enviamos notas cortas sobre usos de IA para negocios. Sin promesas de resultados.",
    "",
    `Para salir de la lista: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `
    <p>Quedaste en la lista de ${SITE_NAME}.</p>
    <p>De vez en cuando enviamos notas cortas sobre usos de IA para negocios. Sin promesas de resultados.</p>
    <p><a href="${unsubscribeUrl}">Salir de la lista</a></p>
  `.trim();

  const { error } = await resend.emails.send(
    {
      from,
      to: [email],
      subject: "Quedaste en la lista de Casos IA",
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
      },
    },
    { idempotencyKey: `newsletter-welcome/${email}` },
  );

  if (error) {
    console.error("No se pudo enviar la bienvenida del boletín", error.name);
    return false;
  }

  return true;
}

export async function sendSponsorReceipt(
  email: string,
  name: string,
  reference: string,
): Promise<boolean> {
  const resend = resendClient();
  const from = resendFrom();
  if (!resend || !from) return false;

  const text = [
    `Hola ${name},`,
    "",
    `Confirmamos el pago del patrocinio en Casos IA (precio de lanzamiento, USD ${SPONSOR_LAUNCH_PRICE_USD}).`,
    "El espacio incluye una ficha en el directorio y una mención en un envío del boletín.",
    "Publicamos la ficha cuando este pago queda registrado. Si el texto necesita un ajuste, responde a este correo.",
  ].join("\n");

  const html = `
    <p>Hola ${escapeHtml(name)},</p>
    <p>Confirmamos el pago del patrocinio en Casos IA (precio de lanzamiento, USD ${SPONSOR_LAUNCH_PRICE_USD}).</p>
    <p>El espacio incluye una ficha en el directorio y una mención en un envío del boletín.</p>
    <p>Publicamos la ficha cuando este pago queda registrado. Si el texto necesita un ajuste, responde a este correo.</p>
  `.trim();

  const { error } = await resend.emails.send(
    {
      from,
      to: [email],
      subject: "Recibimos tu patrocinio en Casos IA",
      html,
      text,
    },
    { idempotencyKey: `sponsor-paid/${reference}` },
  );

  if (error) {
    console.error("No se pudo enviar el correo de patrocinio", error.name);
    return false;
  }

  return true;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
