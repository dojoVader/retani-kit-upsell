const CART_TOTAL = 89;

export interface CartTagProps {
  showProductImage: boolean;
  ctaButtonText: string;
  headline: string;
  requiredTag: string;
  discountType: string;
  discountValue: string;
}

export function CartTag({
  showProductImage,
  ctaButtonText,
  headline,
  requiredTag,
  discountType,
  discountValue,
}: CartTagProps) {
  const originalPrice = 64;
  let salePrice = originalPrice;
  if (discountType === "percent" && Number(discountValue) > 0) {
    salePrice = Math.round(originalPrice * (1 - Number(discountValue) / 100));
  } else if (discountType === "fixed" && Number(discountValue) > 0) {
    salePrice = originalPrice - Number(discountValue);
  }
  const showDiscount = discountType !== "none" && salePrice !== originalPrice;
  const tagLabel = requiredTag ? requiredTag.toUpperCase() : "VIP";

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
          Customer tag
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
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#6b47d6",
              letterSpacing: "0.06em",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            ★ {headline || `MEMBERS ONLY`}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              background: "#faf8ff",
              borderRadius: "8px",
              border: "1px solid #e8e0fa",
            }}
          >
            {showProductImage && (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  background: "#ede8fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                🎒
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "13px", color: "#202223" }}>Summit Daypack</div>
              <div style={{ fontSize: "11px", color: "#6b47d6", marginTop: "1px" }}>{tagLabel} exclusive</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#202223", marginTop: "2px" }}>
                {showDiscount ? (
                  <>
                    <span style={{ color: "#d72c0d" }}>£{salePrice}.00</span>{" "}
                    <span style={{ textDecoration: "line-through", color: "#6d7175", fontWeight: "400" }}>£{originalPrice}.00</span>
                  </>
                ) : (
                  `£${originalPrice}.00`
                )}
              </div>
            </div>
            <button
              style={{
                background: "#6b47d6",
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
