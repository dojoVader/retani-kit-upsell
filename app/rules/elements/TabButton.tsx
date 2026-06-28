export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid #202223" : "2px solid transparent",
        padding: "10px 16px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: active ? "600" : "400",
        color: active ? "#202223" : "#6d7175",
        marginBottom: "-1px",
      }}
    >
      {label}
    </button>
  );
}