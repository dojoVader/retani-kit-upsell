const CART_TOTAL = 89;
const OFFER_ORIGINAL = 20;
const OFFER_PRICE = 16;

export interface CartProductProps {
  showProductImage: boolean;
  ctaButtonText: string;
  headline: string;
  discountType: string;
  discountValue: string;
  showRating: boolean;
}

export function CartProduct({
  showProductImage,
  ctaButtonText,
  headline,
  discountType,
  discountValue,
  showRating,
}: CartProductProps) {
  let salePrice = OFFER_ORIGINAL;
  let discountLabel = "";
  if (discountType === "percent" && Number(discountValue) > 0) {
    salePrice = Math.round(OFFER_ORIGINAL * (1 - Number(discountValue) / 100));
    discountLabel = `${discountValue}% off`;
  } else if (discountType === "fixed" && Number(discountValue) > 0) {
    salePrice = OFFER_ORIGINAL - Number(discountValue);
    discountLabel = `£${discountValue} off`;
  } else {
    salePrice = OFFER_PRICE;
    discountLabel = "10% off";
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
          Product-based
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
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#202223" }}>
              {headline || "You may also like"}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #e3e3e3",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6d7175",
                }}
              >
                ‹
              </button>
              <button
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #e3e3e3",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6d7175",
                }}
              >
                ›
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {showProductImage && (
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#202223",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                  color: "#fff",
                }}
              >
                🔄
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>Merino Socks</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#d72c0d" }}>
                  £{showDiscount ? salePrice : OFFER_PRICE}.00
                </span>
                <span style={{ fontSize: "12px", color: "#6d7175", textDecoration: "line-through" }}>
                  £{OFFER_ORIGINAL}.00
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "1px 6px",
                    borderRadius: "20px",
                    background: "#fff0f0",
                    color: "#d72c0d",
                    border: "1px solid #f9c0b7",
                  }}
                >
                  {discountLabel}
                </span>
              </div>
              {showRating && (
                <div style={{ fontSize: "11px", color: "#ffc200", marginTop: "2px" }}>★★★★☆</div>
              )}
            </div>
            <button
              style={{
                background: "#202223",
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
