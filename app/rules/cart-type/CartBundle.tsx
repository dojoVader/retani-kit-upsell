const CART_TOTAL = 89;
const BUNDLE_ORIGINAL = 158;

const ALL_BUNDLE_ITEMS = [
  { icon: "👟" },
  { icon: "👕" },
  { icon: "🎒" },
];

export interface CartBundleProps {
  showProductImage: boolean;
  ctaButtonText: string;
  maxBundleItems: string;
  bundleDiscount: string;
  bundleDiscountValue: string;
  showCompleteTheSetLabel: boolean;
}

export function CartBundle({
  showProductImage,
  ctaButtonText,
  maxBundleItems,
  bundleDiscount,
  bundleDiscountValue,
  showCompleteTheSetLabel,
}: CartBundleProps) {
  const itemCount = Math.min(Math.max(1, Number(maxBundleItems) || 2), 3);
  const bundleItems = ALL_BUNDLE_ITEMS.slice(0, itemCount);

  let bundlePrice = BUNDLE_ORIGINAL;
  if (bundleDiscount === "percent" && Number(bundleDiscountValue) > 0) {
    bundlePrice = Math.round(BUNDLE_ORIGINAL * (1 - Number(bundleDiscountValue) / 100));
  } else if (bundleDiscount === "fixed" && Number(bundleDiscountValue) > 0) {
    bundlePrice = BUNDLE_ORIGINAL - Number(bundleDiscountValue);
  } else {
    bundlePrice = 146;
  }
  const savedAmount = BUNDLE_ORIGINAL - bundlePrice;

  return (
    <div>
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
          Bundle
        </span>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
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
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#6d7175", lineHeight: 1, padding: 0 }}>×</button>
        </div>

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

        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f1f1" }}>
          {showCompleteTheSetLabel && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#6d7175",
                letterSpacing: "0.06em",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              🛒 FREQUENTLY BOUGHT TOGETHER
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: "#f1f1f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              👟
            </div>
            {bundleItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", color: "#6d7175", fontWeight: "600" }}>+</span>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "#f1f1f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {showProductImage ? item.icon : ""}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "#6d7175", textDecoration: "line-through" }}>£{BUNDLE_ORIGINAL}</span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#202223" }}>£{bundlePrice}</span>
            {savedAmount > 0 && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "2px 7px",
                  borderRadius: "20px",
                  background: "#f1f8f5",
                  color: "#008060",
                  border: "1px solid #b3d9cc",
                }}
              >
                Save £{savedAmount}
              </span>
            )}
          </div>

          <button
            style={{
              width: "100%",
              background: "#202223",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "11px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span>🛒</span> {ctaButtonText} · £{bundlePrice}
          </button>
        </div>

        <div style={{ padding: "14px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#202223", marginBottom: "12px" }}>
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