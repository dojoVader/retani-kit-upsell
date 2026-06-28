import { useState } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartTag } from "./cart-type/CartTag";

type Tab = "trigger" | "offer" | "appearance";

interface TriggerTabProps {
  requiredTag: string; onRequiredTag: (v: string) => void;
  newCustomersOnly: boolean; onNewCustomersOnly: (v: boolean) => void;
  excludeCollections: string; onExcludeCollections: (v: string) => void;
  priority: string; onPriority: (v: string) => void;
  cooldown: string; onCooldown: (v: string) => void;
}

function TriggerTab({
  requiredTag, onRequiredTag,
  newCustomersOnly, onNewCustomersOnly,
  excludeCollections, onExcludeCollections,
  priority, onPriority,
  cooldown, onCooldown,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="requiredTag"
        badge="required"
        description="Shopify customer tag to match"
        control={
          <input
            type="text"
            value={requiredTag}
            placeholder="vip"
            onChange={(e) => onRequiredTag(e.target.value)}
            style={{ width: "180px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="requiresLogin"
        badge="required"
        description="Tags need an authenticated session — rule skips guests instantly"
        control={
          <s-switch
            label="requiresLogin"
            label-accessibility-visibility="hidden"
            checked={true}
            disabled={true}
          />
        }
      />
      <FieldRow
        name="newCustomersOnly"
        badge="optional"
        description="Exclude returning buyers"
        control={
          <s-switch
            label="newCustomersOnly"
            label-accessibility-visibility="hidden"
            checked={newCustomersOnly}
            onChange={(e: any) => onNewCustomersOnly(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="excludeCollections"
        badge="optional"
        control={
          <input
            type="text"
            value={excludeCollections}
            placeholder="e.g. gift-cards"
            onChange={(e) => onExcludeCollections(e.target.value)}
            style={{ width: "180px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
      <FieldRow
        name="priority"
        badge="optional"
        control={
          <input
            type="number"
            value={priority}
            onChange={(e) => onPriority(e.target.value)}
            style={{ width: "70px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
          />
        }
      />
      <FieldRow
        name="cooldown"
        badge="optional"
        control={
          <select
            value={cooldown}
            onChange={(e) => onCooldown(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "120px" }}
          >
            <option value="session">session</option>
            <option value="1day">1 day</option>
            <option value="7days">7 days</option>
            <option value="never">never</option>
          </select>
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
  oneClickAdd: boolean; onOneClickAdd: (v: boolean) => void;
  slotPosition: string; onSlotPosition: (v: string) => void;
}

function OfferTab({
  offerProductId, onOfferProductId,
  headline, onHeadline,
  discountType, onDiscountType,
  discountValue, onDiscountValue,
  oneClickAdd, onOneClickAdd,
  slotPosition, onSlotPosition,
}: OfferTabProps) {
  return (
    <div>
      <FieldRow
        name="offerProductId"
        badge="required"
        description="Product shown to matching customers"
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
        name="oneClickAdd"
        badge="optional"
        control={
          <s-switch
            label="oneClickAdd"
            label-accessibility-visibility="hidden"
            checked={oneClickAdd}
            onChange={(e: any) => onOneClickAdd(e.target.checked)}
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

export default function TagRule() {
  const [activeTab, setActiveTab] = useState<Tab>("trigger");

  // Trigger
  const [requiredTag, setRequiredTag] = useState("vip");
  const [newCustomersOnly, setNewCustomersOnly] = useState(false);
  const [excludeCollections, setExcludeCollections] = useState("");
  const [priority, setPriority] = useState("10");
  const [cooldown, setCooldown] = useState("session");

  // Offer
  const [offerProductId, setOfferProductId] = useState("");
  const [headline, setHeadline] = useState("Exclusive for VIP members");
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState("0");
  const [oneClickAdd, setOneClickAdd] = useState(true);
  const [offerSlotPosition, setOfferSlotPosition] = useState("below-cart-items");

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("Claim");
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
            requiredTag={requiredTag} onRequiredTag={setRequiredTag}
            newCustomersOnly={newCustomersOnly} onNewCustomersOnly={setNewCustomersOnly}
            excludeCollections={excludeCollections} onExcludeCollections={setExcludeCollections}
            priority={priority} onPriority={setPriority}
            cooldown={cooldown} onCooldown={setCooldown}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            offerProductId={offerProductId} onOfferProductId={setOfferProductId}
            headline={headline} onHeadline={setHeadline}
            discountType={discountType} onDiscountType={setDiscountType}
            discountValue={discountValue} onDiscountValue={setDiscountValue}
            oneClickAdd={oneClickAdd} onOneClickAdd={setOneClickAdd}
            slotPosition={offerSlotPosition} onSlotPosition={setOfferSlotPosition}
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
        <CartTag
          showProductImage={showProductImage}
          ctaButtonText={ctaButtonText}
          headline={headline}
          requiredTag={requiredTag}
          discountType={discountType}
          discountValue={discountValue}
        />
      </div>
    </div>
  );
}