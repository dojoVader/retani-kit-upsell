import { useState } from "react";

export type RuleStatus = "active" | "paused";

export type RuleColor = "blue" | "purple" | "orange";

export const RULE_COLORS: Record<RuleColor, { bg: string; text: string }> = {
  blue: { bg: "#e8f1fd", text: "#1c64f2" },
  purple: { bg: "#f2ecfc", text: "#7c3aed" },
  orange: { bg: "#fdeee4", text: "#c2410c" },
};

export type RuleRow = {
  id: number;
  icon: string;
  color: RuleColor;
  title: string;
  description: string;
  type: string;
  revenue: string;
  clicks: string;
  conv: string;
  status: RuleStatus;
};

const STATUS_COLORS: Record<RuleStatus, { bg: string; text: string }> = {
  active: { bg: "#dafbe1", text: "#0f7b3f" },
  paused: { bg: "#fdf1da", text: "#946200" },
};

function RuleIcon({ rule }: { rule: RuleRow }) {
  const color = RULE_COLORS[rule.color];
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: color.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <s-icon type={rule.icon as any} />
    </div>
  );
}

function TypeBadge({ rule }: { rule: RuleRow }) {
  const color = RULE_COLORS[rule.color];
  return (
    <span
      style={{
        display: "inline-block",
        background: color.bg,
        color: color.text,
        fontSize: "12px",
        fontWeight: "600",
        padding: "3px 10px",
        borderRadius: "999px",
      }}
    >
      {rule.type}
    </span>
  );
}

function StatusBadge({ status }: { status: RuleStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      style={{
        display: "inline-block",
        background: color.bg,
        color: color.text,
        fontSize: "12px",
        fontWeight: "600",
        padding: "3px 10px",
        borderRadius: "999px",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

export default function UpsellTable({
  rules,
  onNewRule,
}: {
  rules: RuleRow[];
  onNewRule?: () => void;
}) {
  const [ruleSearch, setRuleSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      ruleSearch.trim().length === 0 ||
      rule.title.toLowerCase().includes(ruleSearch.trim().toLowerCase()) ||
      rule.description.toLowerCase().includes(ruleSearch.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || rule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNewRule = onNewRule ?? (() => open("/app/upsell", "_self"));

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e3e3e3",
        marginTop: "16px",
        overflow: "hidden",
      }}
    >
      {/* Table header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "20px 24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <strong style={{ fontSize: "15px" }}>Upsell rules</strong>
          <span style={{ fontSize: "13px", color: "#6d7175" }}>
            {rules.length} rules
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "200px" }}>
            <s-search-field
              label-accessibility-visibility="hidden"
              placeholder="Search rules..."
              value={ruleSearch}
              onInput={(e: any) => setRuleSearch(e.target.value)}
            />
          </div>
          <div style={{ width: "150px" }}>
            <s-select
              label-accessibility-visibility="hidden"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
            >
              <s-option value="all">All statuses</s-option>
              <s-option value="active">Active</s-option>
              <s-option value="paused">Paused</s-option>
            </s-select>
          </div>

          {/* View toggle */}
          <div
            style={{
              display: "flex",
              border: "1px solid #e3e3e3",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("list")}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                background: viewMode === "list" ? "#1a1a1a" : "#fff",
              }}
            >
              <s-icon type="list-bulleted" tone={viewMode === "list" ? "auto" : "neutral"} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderLeft: "1px solid #e3e3e3",
                cursor: "pointer",
                background: viewMode === "grid" ? "#1a1a1a" : "#fff",
              }}
            >
              <s-icon type="grid" tone={viewMode === "grid" ? "auto" : "neutral"} />
            </button>
          </div>

          <s-button variant="primary" onClick={handleNewRule}>
            + New rule
          </s-button>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          {/* Column headings */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 100px 90px 80px 100px",
              gap: "12px",
              padding: "0 24px 12px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#6d7175",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            <div>Rule</div>
            <div>Type</div>
            <div>Revenue</div>
            <div>Clicks</div>
            <div>Conv.</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          <div>
            {filteredRules.map((rule) => (
              <div key={rule.id}>
                <div style={{ height: "1px", background: "#f1f1f1" }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px 100px 90px 80px 100px",
                    gap: "12px",
                    alignItems: "center",
                    padding: "14px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <RuleIcon rule={rule} />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#202223" }}>
                        {rule.title}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
                        {rule.description}
                      </div>
                    </div>
                  </div>

                  <div>
                    <TypeBadge rule={rule} />
                  </div>

                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#202223" }}>
                    {rule.revenue}
                  </div>
                  <div style={{ fontSize: "14px", color: "#202223" }}>{rule.clicks}</div>
                  <div style={{ fontSize: "14px", color: "#202223" }}>{rule.conv}</div>

                  <div>
                    <StatusBadge status={rule.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Grid view */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            padding: "0 24px 20px",
          }}
        >
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              style={{
                border: "1px solid #e3e3e3",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <RuleIcon rule={rule} />
                <StatusBadge status={rule.status} />
              </div>

              <div style={{ fontSize: "14px", fontWeight: "600", color: "#202223" }}>
                {rule.title}
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175", marginTop: "2px" }}>
                {rule.description}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "14px",
                }}
              >
                <TypeBadge rule={rule} />
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#202223" }}>
                    {rule.revenue}
                  </span>{" "}
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#202223" }}>
                    {rule.conv}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer / pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderTop: "1px solid #f1f1f1",
        }}
      >
        <span style={{ fontSize: "13px", color: "#6d7175" }}>
          Showing {filteredRules.length === 0 ? 0 : 1}-{Math.min(5, filteredRules.length)} of{" "}
          {rules.length} rules
        </span>
        <s-button-group>
          <s-button variant="secondary" disabled>
            ← Prev
          </s-button>
          <s-button variant="primary">1</s-button>
          <s-button variant="secondary">2</s-button>
          <s-button variant="secondary">Next →</s-button>
        </s-button-group>
      </div>
    </div>
  );
}
