const CART_TOTAL = 89;

const UPSELL_ITEMS = [
  { name: "Insoles Pro", price: 18, icon: "👟" },
  { name: "Water Bottle", price: 22, icon: "🧴" },
];

export interface CartThresholdProps {
  threshold: number;
  showProgressBar: boolean;
  completionMessage: string;
  headline: string;
  ctaButtonText: string;
  showProductImage: boolean;
}

export function CartThreshold({
  threshold,
  showProgressBar,
  completionMessage,
  headline,
  ctaButtonText,
  showProductImage,
}: CartThresholdProps) {
  const gap = Math.max(0, threshold - CART_TOTAL);
  const progress = Math.min(100, (CART_TOTAL / threshold) * 100);
  const reached = CART_TOTAL >= threshold;

  const resolvedHeadline = reached
    ? completionMessage
    : headline.replace("{gap}", `£${gap}`);

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "#202223" }}>Cart preview</div>
          <div style={{ fontSize: "12px", color: "#6d7175", marginTop: "2px" }}>Live — click to interact</div>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            padding: "3px 10px",
            borderRadius: "20px",
            background: "#f4f0ff",
            color: "#6b47d6",
            border: "1px solid #d2c0f9",
          }}
        >
          Threshold
        </span>
      </div>

      {/* Cart widget */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        {/* Cart header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <span style={{ fontWeight: "600", fontSize: "15px", color: "#202223" }}>Your cart</span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#6d7175",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Cart item */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 20px",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          {showProductImage && (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                background: "#f1f1f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              👟
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>Running Pro X</div>
            <div style={{ fontSize: "12px", color: "#6d7175" }}>£89.00 · Size 9</div>
          </div>
          <span style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>£{CART_TOTAL}</span>
        </div>

        {/* Progress bar */}
        {showProgressBar && (
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f1f1" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#202223" }}>{resolvedHeadline}</span>
              <span style={{ color: "#6d7175", fontWeight: "500" }}>
                £{CART_TOTAL}/£{threshold}
              </span>
            </div>
            <div
              style={{
                height: "5px",
                background: "#e3e3e3",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: reached ? "#008060" : "#1a6b3a",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Upsell section */}
        <div style={{ padding: "10px 20px 4px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#6d7175",
              letterSpacing: "0.06em",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>✦</span> ADD TO UNLOCK FREE SHIPPING
          </div>

          {UPSELL_ITEMS.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 0",
                borderBottom: "1px solid #f1f1f1",
              }}
            >
              {showProductImage && (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    background: "#f1f1f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "500", fontSize: "13px", color: "#202223" }}>{item.name}</div>
                <div style={{ fontSize: "12px", color: "#6d7175" }}>£{item.price}.00</div>
              </div>
              <button
                style={{
                  background: "#202223",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {ctaButtonText}
              </button>
            </div>
          ))}
        </div>

        {/* Subtotal + Checkout */}
        <div style={{ padding: "14px 20px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#202223",
              marginBottom: "12px",
            }}
          >
            <span>Subtotal</span>
            <span style={{ fontWeight: "600" }}>£{CART_TOTAL}</span>
          </div>
          <button
            style={{
              width: "100%",
              background: "#202223",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
