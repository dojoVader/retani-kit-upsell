import { useState } from "react";

type PlanId = "free" | "pro";

const FREE_FEATURES = [
  { label: "Basic cart drawer", included: true },
  { label: "1 active upsell rule", included: true },
  { label: "App branding shown", included: false },
];

const PRO_FEATURES = [
  { label: "Unlimited upsell rules", included: true },
  { label: "A/B testing & analytics", included: true },
  { label: "Remove app branding", included: true },
];

function ProBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#ede9fe",
        color: "#6d28d9",
        fontSize: "12px",
        fontWeight: "600",
        padding: "2px 8px",
        borderRadius: "20px",
      }}
    >
      Recommended
    </span>
  );
}

function CurrentBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        background: "transparent",
        color: "#202223",
        fontSize: "12px",
        fontWeight: "500",
        padding: "2px 8px",
        borderRadius: "20px",
        border: "1px solid #c9cccf",
      }}
    >
      Current plan
    </span>
  );
}

export default function PlanPage() {
  const [currentPlan] = useState<PlanId>("free");

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page
      {...({
        heading: "Plan",
        subheading: `You're on the Free plan. Upgrade for unlimited rules and analytics.`,
      } as any)}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Free plan card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: currentPlan === "free" ? "2px solid #202223" : "1px solid #e3e3e3",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <CurrentBadge />
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#202223", marginBottom: "6px" }}>
            Free
          </div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#202223" }}>$0</span>
            <span style={{ fontSize: "14px", color: "#6d7175" }}> / month</span>
          </div>

          <div style={{ height: "1px", background: "#e3e3e3", margin: "0 0 20px" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FREE_FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: f.included ? "#202223" : "#8c9196",
                }}
              >
                <s-icon
                  type={f.included ? "check-circle-filled" : "x-circle"}
                  tone={f.included ? "success" : "neutral"}
                />
                <span style={{ fontSize: "14px" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro plan card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: currentPlan === "pro" ? "2px solid #202223" : "1px solid #e3e3e3",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <ProBadge />
          </div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#202223", marginBottom: "6px" }}>
            Pro
          </div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#202223" }}>$19</span>
            <span style={{ fontSize: "14px", color: "#6d7175" }}> / month</span>
          </div>

          <div style={{ height: "1px", background: "#e3e3e3", margin: "0 0 20px" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
            {PRO_FEATURES.map((f) => (
              <div
                key={f.label}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <s-icon type="check-circle-filled" tone="success" />
                <span style={{ fontSize: "14px", color: "#202223" }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              style={{
                width: "100%",
                background: "#202223",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </s-page>
  );
}
