import { initials } from "../../utils/helpers";

function Avatar({ name, size = 36 }) {
  const cols = ["#C05A28", "#5E7252", "#C8A96E", "#3A5F8B", "#8B4040"];
  const idx = (name || "?").charCodeAt(0) % cols.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `${cols[idx]}33`,
        border: `1.5px solid ${cols[idx]}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 600,
        color: cols[idx],
        fontFamily: "Cormorant Garamond, serif",
        letterSpacing: "0.05em",
      }}
    >
      {initials(name || "?")}
    </div>
  );
}

export {Avatar}