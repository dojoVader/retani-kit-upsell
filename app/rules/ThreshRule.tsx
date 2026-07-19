import { useState, useEffect } from "react";
import { FieldRow, TabButton, ActionRow } from "./elements";
import { CartThreshold } from "./cart-type/CartThreshold";
import { useAuthenticatedFetch } from "./../utils/useAuthenticatedFetch";
import { BACKEND_ENDPOINTS } from "app/utils/endpoints";

type Tab = "trigger" | "offer" | "appearance";

// ─── Trigger tab ─────────────────────────────────────────────────────────────

interface TriggerTabProps {
  threshold: string; onThreshold: (v: string) => void;
  triggerMoment: string; onTriggerMoment: (v: string) => void;
  excludeCollections: string; onExcludeCollections: (v: string) => void;
  showProgressBar: boolean; onShowProgressBar: (v: boolean) => void;
  completionMessage: string; onCompletionMessage: (v: string) => void;
}

function TriggerTab({
  threshold, onThreshold,
  triggerMoment, onTriggerMoment,
  excludeCollections, onExcludeCollections,
  showProgressBar, onShowProgressBar,
  completionMessage, onCompletionMessage,
}: TriggerTabProps) {
  return (
    <div>
      <FieldRow
        name="threshold"
        badge="required"
        description="Fire when cart subtotal is below this value"
        control={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>£</span>
            <input
              type="number"
              value={threshold}
              min={0}
              onChange={(e) => onThreshold(e.target.value)}
              style={{ width: "80px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", textAlign: "right" }}
            />
          </div>
        }
      />
      <FieldRow
        name="triggerMoment"
        badge="optional"
        control={
          <select
            value={triggerMoment}
            onChange={(e) => onTriggerMoment(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "160px" }}
          >
            <option value="onCartOpen">onCartOpen</option>
            <option value="onPageLoad">onPageLoad</option>
            <option value="onAddToCart">onAddToCart</option>
          </select>
        }
      />
      <FieldRow
        name="excludeCollections"
        badge="optional"
        description="Never fire if cart contains these"
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
        name="showProgressBar"
        badge="optional"
        description="Visual bar showing distance to target"
        control={
          <s-switch
            label="showProgressBar"
            label-accessibility-visibility="hidden"
            checked={showProgressBar}
            onChange={(e: any) => onShowProgressBar(e.target.checked)}
          />
        }
      />
      <FieldRow
        name="completionMessage"
        badge="optional"
        description="Shown when threshold is reached"
        control={
          <input
            type="text"
            value={completionMessage}
            onChange={(e) => onCompletionMessage(e.target.value)}
            style={{ width: "200px", padding: "7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px" }}
          />
        }
      />
    </div>
  );
}

// ─── Offer tab ────────────────────────────────────────────────────────────────

interface OfferTabProps {
  productSelection: string; onProductSelection: (v: string) => void;
  headline: string; onHeadline: (v: string) => void;
  discountType: string; onDiscountType: (v: string) => void;
  discountValue: string; onDiscountValue: (v: string) => void;
  priority: string; onPriority: (v: string) => void;
  cooldown: string; onCooldown: (v: string) => void;
  abTest: boolean; onAbTest: (v: boolean) => void;
}

function OfferTab({
  productSelection, onProductSelection,
  headline, onHeadline,
  discountType, onDiscountType,
  discountValue, onDiscountValue,
  priority, onPriority,
  cooldown, onCooldown,
  abTest, onAbTest,
}: OfferTabProps) {
  return (
    <div>
      <FieldRow
        name="productSelection"
        badge="required"
        description="How to pick the offer product"
        control={
          <select
            value={productSelection}
            onChange={(e) => onProductSelection(e.target.value)}
            style={{ padding: "7px 28px 7px 10px", border: "1px solid #c9cccf", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer", minWidth: "180px" }}
          >
            <option value="cheapest">Cheapest qualifying</option>
            <option value="most-expensive">Most expensive</option>
            <option value="manual">Manual selection</option>
          </select>
        }
      />
      <FieldRow
        name="headline"
        badge="optional"
        description="{gap} resolves to £ remaining"
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
        name="priority"
        badge="optional"
        description="Higher wins conflict resolution"
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
      <FieldRow
        name="abTest"
        badge="pro"
        control={
          <s-switch
            label="abTest"
            label-accessibility-visibility="hidden"
            checked={abTest}
            onChange={(e: any) => onAbTest(e.target.checked)}
          />
        }
      />
    </div>
  );
}

// ─── Appearance tab ───────────────────────────────────────────────────────────

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
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ThreshRule() {


  // Shopify Authenticated Fetch
  const shopifyFetch = useAuthenticatedFetch();
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tab>("trigger");
  const [ruleType, setRuleType] = useState<string>("threshold");

  // Trigger
  const [threshold, setThreshold] = useState("100");
  const [triggerMoment, setTriggerMoment] = useState("onCartOpen");
  const [excludeCollections, setExcludeCollections] = useState("");
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [completionMessage, setCompletionMessage] = useState("Free shipping unlocked!");

  // Offer
  const [productSelection, setProductSelection] = useState("cheapest");
  const [headline, setHeadline] = useState("You're £{gap} away!");
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState("0");
  const [priority, setPriority] = useState("10");
  const [cooldown, setCooldown] = useState("session");
  const [abTest, setAbTest] = useState(false);

  // Appearance
  const [ctaButtonText, setCtaButtonText] = useState("+ Add");
  const [slotPosition, setSlotPosition] = useState("below-cart-items");
  const [showProductImage, setShowProductImage] = useState(true);
  const [showStarRatings, setShowStarRatings] = useState(false);

  // UseEffect listen to the Submit Functionality

  const submitRules = () => {
    console.log("Submitting to the Server....")
    const response = shopifyFetch(BACKEND_ENDPOINTS.SAVE_RULES, {
      method: 'POST',
      body: JSON.stringify({
          type: ruleType,
          config: {
            threshold,
            triggerMoment,
            excludeCollections,
            showProgressBar,
            completionMessage,
            productSelection,
            headline,
            discountType,
            discountValue,
            priority,
            cooldown,
            abTest,
            ctaButtonText,
            slotPosition,
            showProductImage,
            showStarRatings,
          }
      })
    })
    response.then(data => {
      console.log(data.json())
    })
}

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px", alignItems: "start" }}>
      {/* Left: form panel */}
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
            threshold={threshold} onThreshold={setThreshold}
            triggerMoment={triggerMoment} onTriggerMoment={setTriggerMoment}
            excludeCollections={excludeCollections} onExcludeCollections={setExcludeCollections}
            showProgressBar={showProgressBar} onShowProgressBar={setShowProgressBar}
            completionMessage={completionMessage} onCompletionMessage={setCompletionMessage}
          />
        )}
        {activeTab === "offer" && (
          <OfferTab
            productSelection={productSelection} onProductSelection={setProductSelection}
            headline={headline} onHeadline={setHeadline}
            discountType={discountType} onDiscountType={setDiscountType}
            discountValue={discountValue} onDiscountValue={setDiscountValue}
            priority={priority} onPriority={setPriority}
            cooldown={cooldown} onCooldown={setCooldown}
            abTest={abTest} onAbTest={setAbTest}
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

        <ActionRow onSave={() => submitRules()} />
      </div>

      {/* Right: live cart preview */}
      <div style={{ position: "sticky", top: "16px" }}>
        <CartThreshold
          threshold={Number(threshold) || 100}
          showProgressBar={showProgressBar}
          completionMessage={completionMessage}
          headline={headline}
          ctaButtonText={ctaButtonText}
          showProductImage={showProductImage}
        />
      </div>
    </div>
  );
}
