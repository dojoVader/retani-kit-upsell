import { useState } from "react";

const PREVIEW_CART_AMOUNT = 36.0;

export default function FreeShippingPage() {
  const [showBar, setShowBar] = useState(true);
  const [threshold, setThreshold] = useState(50);
  const [belowMessage, setBelowMessage] = useState(
    "Spend {amount} more for free shipping"
  );
  const [atMessage, setAtMessage] = useState("You've unlocked free shipping");

  const remaining = Math.max(0, threshold - PREVIEW_CART_AMOUNT);
  const progress = Math.min(100, (PREVIEW_CART_AMOUNT / threshold) * 100);
  const isAtThreshold = PREVIEW_CART_AMOUNT >= threshold;

  const renderPreviewMessage = () => {
    if (isAtThreshold) return <span>{atMessage}</span>;
    const parts = belowMessage.split("{amount}");
    return (
      <span>
        {parts[0]}
        <strong>${remaining.toFixed(2)}</strong>
        {parts[1]}
      </span>
    );
  };

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page {...({ heading: "Free shipping bar", subheading: "Encourage larger carts with a progress bar toward free shipping." } as any)}>
      {/* Settings card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        {/* Toggle row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
          }}
        >
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
              Show free shipping bar
            </div>
            <div style={{ fontSize: "13px", color: "#6d7175" }}>
              Displays at the top of the cart drawer.
            </div>
          </div>
          <s-switch
            label="Show free shipping bar"
            label-accessibility-visibility="hidden"
            checked={showBar}
            onChange={(e: any) => setShowBar(e.target.checked)}
          />
        </div>

        <div style={{ height: "1px", background: "#e3e3e3" }} />

        {/* Fields */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Threshold amount */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              Threshold amount
            </div>
            <div style={{ maxWidth: "160px" }}>
              <s-money-field
                label="Threshold amount"
                label-accessibility-visibility="hidden"
                value={String(threshold)}
                min={0}
                onInput={(e: any) =>
                  setThreshold(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>

          {/* Below threshold message */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              Below threshold message
            </div>
            <s-text-field
              label="Below threshold message"
              label-accessibility-visibility="hidden"
              value={belowMessage}
              onInput={(e: any) => setBelowMessage(e.target.value)}
            />
            <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "6px" }}>
              Use{" "}
              <code
                style={{
                  background: "#f1f1f1",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#bf4800",
                }}
              >
                {"{amount}"}
              </code>{" "}
              to insert the remaining spend.
            </div>
          </div>

          {/* At threshold message */}
          <div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>
              At threshold message
            </div>
            <s-text-field
              label="At threshold message"
              label-accessibility-visibility="hidden"
              value={atMessage}
              onInput={(e: any) => setAtMessage(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Preview card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "20px 24px",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>
          Preview
        </div>

        {/* Shipping bar widget */}
        <div
          style={{
            background: "#f6f6f7",
            borderRadius: "8px",
            padding: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "16px 20px",
              minWidth: "320px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "10px",
                color: "#202223",
              }}
            >
              {renderPreviewMessage()}
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: "6px",
                background: "#e3e3e3",
                borderRadius: "3px",
                marginBottom: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: isAtThreshold ? "#008060" : "#2c6ecb",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Labels row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#6d7175",
              }}
            >
              <span>${PREVIEW_CART_AMOUNT.toFixed(2)} in cart</span>
              <span>${threshold.toFixed(2)} goal</span>
            </div>
          </div>
        </div>
      </div>
    </s-page>
  );
}
