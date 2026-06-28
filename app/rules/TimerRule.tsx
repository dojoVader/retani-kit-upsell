import { useState } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartTimer } from "./cart-type/CartTimer";

type Tab = "trigger" | "offer" | "appearance";

interface TriggerTabProps {
  minCartValue: string; onMinCartValue: (v: string) => void;
  oncePerSession: boolean; onOncePerSession: (v: boolean) => void;
  priority: string; onPriority: (v: string) => void;
}

function TriggerTab({
  minCartValue, onMinCartValue,
  oncePerSession, onOncePerSession,
  priority, onPriority,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="minCartValue"
        badge="required"
        description="Only fire if cart is above this amount"
        control={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>£</span>
            <input
              type="number"
              value={minCartValue}
              min={0}
              onChange={(e) => onMinCartValue(e.target.value)}
              style={{ width: "80px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
            />
          </div>
        }
      />
      <FieldRow
        name="firesOn"
        badge="required"
        description="Cannot be changed — this rule is event-driven"
        control={
          <select
            value="checkoutClick"
            disabled
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#f6f6f7", cursor: "not-allowed", minWidth: "160px", color: "#6d7175" }}
          >
            <option value="checkoutClick">checkoutClick</option>
          </select>
        }
      />
      <FieldRow
        name="oncePerSession"
        badge="optional"
        description="Don't interrupt more than once"
        control={
          <s-switch
            label="oncePerSession"
            label-accessibility-visibility="hidden"
            checked={oncePerSession}
            onChange={(e: any) => onOncePerSession(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="priority"
        badge="optional"
        description="Defaults to 99 — always highest"
        control={
          <input
            type="number"
            value={priority}
            onChange={(e) => onPriority(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

interface OfferTabProps {
  offerProductId: string; onOfferProductId: (v: string) => void;
  headline: string; onHeadline: (v: string) => void;
  discountType: string; onDiscountType: (v: string) => void;
  discountValue: string; onDiscountValue: (v: string) => void;
  ctaButtonText: string; onCtaButtonText: (v: string) => void;
  countdownTimer: boolean; onCountdownTimer: (v: boolean) => void;
}

function OfferTab({
  offerProductId, onOfferProductId,
  headline, onHeadline,
  discountType, onDiscountType,
  discountValue, onDiscountValue,
  ctaButtonText, onCtaButtonText,
  countdownTimer, onCountdownTimer,
}: OfferTabProps) {
  return (
    <div>
      <FieldRow
        name="offerProductId"
        badge="required"
        description="Product shown in the intercept modal"
        control={
          <input
            type="text"
            value={offerProductId}
            placeholder="Search products..."
            onChange={(e) => onOfferProductId(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="headline"
        badge="optional"
        control={
          <input
            type="text"
            value={headline}
            onChange={(e) => onHeadline(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="discountType"
        badge="optional"
        control={
          <select
            value={discountType}
            onChange={(e) => onDiscountType(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "100px" }}
          >
            <option value="none">none</option>
            <option value="percent">% off</option>
            <option value="fixed">£ off</option>
          </select>
        }
      />
      <FieldRow
        name="discountValue"
        badge="optional"
        control={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>%</span>
            <input
              type="number"
              value={discountValue}
              min={0}
              onChange={(e) => onDiscountValue(e.target.value)}
              style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
            />
          </div>
        }
      />
      <FieldRow
        name="ctaButtonText"
        badge="optional"
        control={
          <input
            type="text"
            value={ctaButtonText}
            onChange={(e) => onCtaButtonText(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="countdownTimer"
        badge="pro"
        description="Urgency timer shown on modal"
        control={
          <s-switch
            label="countdownTimer"
            label-accessibility-visibility="hidden"
            checked={countdownTimer}
            onChange={(e: any) => onCountdownTimer(e.target.checked)}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

interface AppearanceTabProps {
  ctaButtonText: string; onCtaButtonText: (v: string) => void;
  slotPosition: string; onSlotPosition: (v: string) => void;
  showProductImage: boolean; onShowProductImage: (v: boolean) => void;
  showStarRatings: boolean; onShowStarRatings: (v: boolean) => void;
}

function AppearanceTab({
  ctaButtonText, onCtaButtonText,
  slotPosition, onSlotPosition,
  showProductImage, onShowProductImage,
  showStarRatings, onShowStarRatings,
}: AppearanceTabProps) {
  return (
    <div>
      <FieldRow
        name="ctaButtonText"
        badge="optional"
        control={
          <input
            type="text"
            value={ctaButtonText}
            onChange={(e) => onCtaButtonText(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="slotPosition"
        badge="optional"
        control={
          <select
            value={slotPosition}
            onChange={(e) => onSlotPosition(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "180px" }}
          >
            <option value="below-cart-items">Below cart items</option>
            <option value="above-cart-items">Above cart items</option>
            <option value="below-subtotal">Below subtotal</option>
          </select>
        }
      />
      <FieldRow
        name="showProductImage"
        badge="optional"
        control={
          <s-switch
            label="showProductImage"
            label-accessibility-visibility="hidden"
            checked={showProductImage}
            onChange={(e: any) => onShowProductImage(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="showStarRatings"
        badge="pro"
        control={
          <s-switch
            label="showStarRatings"
            label-accessibility-visibility="hidden"
            checked={showStarRatings}
            onChange={(e: any) => onShowStarRatings(e.target.checked)}
          />
        }
      />
      <ActionRow />
    </div>
  );
}

export default function TimerRule() {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");

  // Trigger
  const [minCartValue, setMinCartValue] = useState("20");
  const [oncePerSession, setOncePerSession] = useState(true);
  const [priority, setPriority] = useState("99");

  // Offer
  const [offerProductId, setOfferProductId] = useState("");
  const [headline, setHeadline] = useState("Wait — one last thing!");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("15");
  const [offerCtaButtonText, setOfferCtaButtonText] = useState("Add and checkout");
  const [countdownTimer, setCountdownTimer] = useState(false);

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("Add");
  const [slotPosition, setSlotPosition] = useState("below-cart-items");
  const [showProductImage, setShowProductImage] = useState(true);
  const [showStarRatings, setShowStarRatings] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px", alignItems: "start" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e3e3e3",
          padding: "0 24px 24px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid #e3e3e3", marginBottom: "4px" }}>
          <TabButton label="Trigger" active={activeTab === "trigger"} onClick={() => setActiveTab("trigger")} />
          <TabButton label="Offer" active={activeTab === "offer"} onClick={() => setActiveTab("offer")} />
          <TabButton label="Appearance" active={activeTab === "appearance"} onClick={() => setActiveTab("appearance")} />
        </div>

        {activeTab === "trigger" && (
          <TriggerTab
            minCartValue={minCartValue} onMinCartValue={setMinCartValue}
            oncePerSession={oncePerSession} onOncePerSession={setOncePerSession}
            priority={priority} onPriority={setPriority}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            offerProductId={offerProductId} onOfferProductId={setOfferProductId}
            headline={headline} onHeadline={setHeadline}
            discountType={discountType} onDiscountType={setDiscountType}
            discountValue={discountValue} onDiscountValue={setDiscountValue}
            ctaButtonText={offerCtaButtonText} onCtaButtonText={setOfferCtaButtonText}
            countdownTimer={countdownTimer} onCountdownTimer={setCountdownTimer}
          />
        )}
        {activeTab === "appearance" && (
          <AppearanceTab
            ctaButtonText={ctaButtonText} onCtaButtonText={setCtaButtonText}
            slotPosition={slotPosition} onSlotPosition={setSlotPosition}
            showProductImage={showProductImage} onShowProductImage={setShowProductImage}
            showStarRatings={showStarRatings} onShowStarRatings={setShowStarRatings}
          />
        )}
      </div>

      <div style={{ position: "sticky", top: "16px" }}>
        <CartTimer
          showProductImage={showProductImage}
          ctaButtonText={ctaButtonText}
          headline={headline}
          discountType={discountType}
          discountValue={discountValue}
          countdownTimer={countdownTimer}
        />
      </div>
    </div>
  );
}