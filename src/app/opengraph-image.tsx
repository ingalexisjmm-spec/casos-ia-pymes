import { ImageResponse } from "next/og";

import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE, SHARE_IMAGE_TYPE } from "@/lib/share-image";

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_TYPE;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#f4f6f8",
          color: "#101318",
        }}
      >
        <div style={{ display: "flex", width: 14, height: "100%", background: "#246BFF" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 64px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, fontWeight: 650 }}>Casos IA</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
              Usos de IA para negocios
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#5c6570" }}>
              Problema, herramientas y dificultad.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
