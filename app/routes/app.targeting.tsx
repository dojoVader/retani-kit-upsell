import { useState, type ReactNode } from "react";

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        gap: "24px",
      }}
    >
      <div>
        <div style={{ fontWeight: "600", fontSize: "14px", color: "#202223" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
          {description}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#e3e3e3", margin: "0 24px" }} />;
}

function Card({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e3e3e3",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontWeight: "600",
          fontSize: "15px",
          padding: "16px 24px 12px",
          color: "#202223",
        }}
      >
        {heading}
      </div>
      <Divider />
      {children}
    </div>
  );
}

export default function TargetingPage() {
  const [customerSegment, setCustomerSegment] = useState("all");
  const [showNewVisitors, setShowNewVisitors] = useState(true);
  const [showReturning, setShowReturning] = useState(true);
  const [mobileDevices, setMobileDevices] = useState(true);
  const [countries, setCountries] = useState("all");
  const [minItems, setMinItems] = useState(1);

  return (
    // subheading is a valid s-page runtime prop; cast needed because polaris-types omits it
    <s-page {...({ heading: "Targeting", subheading: "Choose which shoppers and devices see upsell offers." } as any)}
    >
      {/* Audience card */}
      <Card heading="Audience">
        <SettingRow
          title="Customer segment"
          description="Who is eligible for offers"
          control={
            <s-select
              label="Customer segment"
              label-accessibility-visibility="hidden"
              value={customerSegment}
              onChange={(e: any) => setCustomerSegment(e.target.value)}
            >
              <s-option value="all">All shoppers</s-option>
              <s-option value="logged_in">Logged-in customers</s-option>
              <s-option value="guests">Guests only</s-option>
            </s-select>
          }
        />
        <Divider />
        <SettingRow
          title="Show to new visitors"
          description="No prior purchase history"
          control={
            <s-switch
              label="Show to new visitors"
              label-accessibility-visibility="hidden"
              checked={showNewVisitors}
              onChange={(e: any) => setShowNewVisitors(e.target.checked)}
            />
          }
        />
        <Divider />
        <SettingRow
          title="Show to returning buyers"
          description="At least one prior order"
          control={
            <s-switch
              label="Show to returning buyers"
              label-accessibility-visibility="hidden"
              checked={showReturning}
              onChange={(e: any) => setShowReturning(e.target.checked)}
            />
          }
        />
      </Card>

      {/* Placement card */}
      <Card heading="Placement">
        <SettingRow
          title="Mobile devices"
          description="Show the drawer on phones"
          control={
            <s-switch
              label="Mobile devices"
              label-accessibility-visibility="hidden"
              checked={mobileDevices}
              onChange={(e: any) => setMobileDevices(e.target.checked)}
            />
          }
        />
        <Divider />
        <SettingRow
          title="Countries"
          description="Limit by shipping destination"
          control={
            <s-select
              label="Countries"
              label-accessibility-visibility="hidden"
              value={countries}
              onChange={(e: any) => setCountries(e.target.value)}
            >
              <s-option value="all">All countries</s-option>
              <s-option value="us">United States</s-option>
              <s-option value="ca">Canada</s-option>
              <s-option value="gb">United Kingdom</s-option>
              <s-option value="au">Australia</s-option>
            </s-select>
          }
        />
        <Divider />
        <SettingRow
          title="Minimum items in cart"
          description="Only target carts with at least N items"
          control={
            <div style={{ width: "80px" }}>
              <s-number-field
                label="Minimum items in cart"
                label-accessibility-visibility="hidden"
                value={String(minItems)}
                min={1}
                step={1}
                onInput={(e: any) =>
                  setMinItems(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          }
        />
      </Card>
    </s-page>
  );
}
