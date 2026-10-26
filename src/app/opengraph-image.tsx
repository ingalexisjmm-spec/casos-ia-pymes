import { ImageResponse } from "next/og";

export const alt = "Casos IA — Usos de inteligencia artificial para negocios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#f3efe6",
          color: "#1a1814",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6 }}>CASOS IA</div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.05,
            marginTop: 40,
            maxWidth: 920,
          }}
        >
          Usos de IA para negocios
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#1e5640" }}>
          Problema, herramientas y dificultad. Sin métricas inventadas.
        </div>
      </div>
    ),
    { ...size },
  );
}
