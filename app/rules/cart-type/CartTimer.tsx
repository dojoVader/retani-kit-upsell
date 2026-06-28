const CART_TOTAL = 89;

export interface CartTimerProps {
  showProductImage: boolean;
  ctaButtonText: string;
  headline: string;
  discountType: string;
  discountValue: string;
  countdownTimer: boolean;
}

export function CartTimer({
  showProductImage,
  ctaButtonText,
  headline,
  discountType,
  discountValue,
  countdownTimer,
}: CartTimerProps) {
  const originalPrice = 9.99;
  let salePrice = 8.49;
  let discountBadge = "-15%";
  if (discountType === "percent" && Number(discountValue) > 0) {
    salePrice = Math.round(originalPrice * (1 - Number(discountValue) / 100) * 100) / 100;
    discountBadge = `-${discountValue}%`;
  } else if (discountType === "fixed" && Number(discountValue) > 0) {
    salePrice = Math.round((originalPrice - Number(discountValue)) * 100) / 100;
    discountBadge = `-£${discountValue}`;
  }
  const showDiscount = discountType !== "none";

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
          Last chance
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#c4290d",
                letterSpacing: "0.06em",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ⚡ LAST CHANCE
            </div>
            {countdownTimer && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "#c4290d",
                  color: "#fff",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                00:00
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              background: "#fff8f7",
              borderRadius: "8px",
              border: "1px solid #f9d5cf",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              {showProductImage && (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "6px",
                    background: "#fde8e4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  👑
                </div>
              )}
              {showDiscount && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: "-6px",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "1px 4px",
                    borderRadius: "4px",
                    background: "#c4290d",
                    color: "#fff",
                  }}
                >
                  {discountBadge}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "13px", color: "#202223" }}>Premium Membership</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#202223" }}>
                  £{showDiscount ? salePrice.toFixed(2) : "8.49"}
                </span>
                <span style={{ fontSize: "12px", color: "#6d7175", textDecoration: "line-through" }}>
                  £{originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              style={{
                background: "#c4290d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 12px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {ctaButtonText}
            </button>
          </div>
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
