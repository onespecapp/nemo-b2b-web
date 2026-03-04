import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "OneSpec - AI-Powered Appointment Reminder Calls";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f8f5ef",
          position: "relative",
        }}
      >
        {/* Teal accent — top left */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(15,118,110,0.25), transparent 70%)",
          }}
        />

        {/* Orange accent — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: -40,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#0f1f1a",
              fontFamily: "serif",
            }}
          >
            OneSpec
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#0f766e",
            }}
          >
            AI-Powered Appointment Reminder Calls
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 20,
              color: "#0f1f1a",
              opacity: 0.6,
            }}
          >
            Reduce no-shows by 50% — built for service businesses
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#0f766e" }} />
          <div style={{ flex: 1, backgroundColor: "#f97316" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
