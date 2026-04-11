import { AMENITY_FILTERS } from "../../constants";
import { fmt } from "../../utils/helpers";

export default function FiltersSidebar({ selectedAmenities, setSelectedAmenities, priceMax, setPriceMax }) {
  const toggle = (v) =>
    setSelectedAmenities((a) => a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

  return (
    <div className="filters-sidebar">
      <div className="filters-sticky">
        <div className="filter-group">
          <div className="filter-group-title">Price (max)</div>
          <input
            type="range" min="1000" max="30000" step="500"
            value={priceMax} onChange={(e) => setPriceMax(+e.target.value)}
            className="price-range" style={{ width: "100%" }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", color:"var(--stone)", marginTop:6 }}>
            <span>₹1k</span>
            <span style={{ color:"var(--charcoal)", fontWeight:500 }}>{fmt(priceMax)}</span>
            <span>₹30k</span>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-group-title">Amenities</div>
          {AMENITY_FILTERS.map((a) => (
            <label key={a.value} className="filter-check" style={{ cursor:"pointer" }}>
              <div className="filter-check-left">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a.value)}
                  onChange={() => toggle(a.value)}
                  style={{ accentColor:"var(--terracotta)" }}
                />
                {a.label}
              </div>
              <span className="filter-check-count">{a.count}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
