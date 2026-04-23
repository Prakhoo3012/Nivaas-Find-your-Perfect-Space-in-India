export const fmt     = (n) => "₹" + n.toLocaleString("en-IN");
export const fmtDate = (s) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const meajdfhj="Hello";