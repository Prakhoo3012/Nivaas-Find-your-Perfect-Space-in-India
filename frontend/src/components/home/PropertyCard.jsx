import { Link } from "react-router-dom";
import { AMENITY_LABEL_MAP } from "../../constants";
import { fmt } from "../../utils/helpers";

export default function PropertyCard({ listing: l, idx, wishlist, toggleWishlist }) {
  return (
    <Link
      to={`/properties/get-property/${l._id}`}
      className="prop-card"
      style={{ animationDelay: `${idx * 0.04}s` }}
    >
      <div className="prop-img">
        <svg
          className="prop-img-icon"
          width="40" height="40" viewBox="0 0 24 24"
          fill="none" stroke="var(--stone2)" strokeWidth="1.2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {l.isNew && <div className="prop-badge-new">New</div>}
        <button
          className={`prop-wish${wishlist ? " active" : ""}`}
          onClick={(e) => {
            e.preventDefault();     // ← stop Link navigation
            e.stopPropagation();
            toggleWishlist(l._id);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      <div className="prop-body">
        <div className="prop-type-row">
          <span className="prop-type">{l?.propertyType}</span>
          {l.ratings.count > 0 && (
            <div className="prop-rating">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--terracotta)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {l?.ratings?.average}
            </div>
          )}
        </div>
        <div className="prop-title">{l.title}</div>
        <div className="prop-loc">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {l.location.city}, {l.location.state}
        </div>
        <div className="prop-amenities">
          {l.amenities.slice(0, 3).map((a) => (
            <span key={a} className="prop-amenity">
              {AMENITY_LABEL_MAP[a] || a}
            </span>
          ))}
        </div>
        <div className="prop-footer">
          <div>
            <span className="prop-price">{fmt(l.pricing.basePrice)}</span>
            <span className="prop-price-period"> /{l.pricing.priceType.replace("per_", "")}</span>
          </div>
          <span className="prop-area">{l.roomInfo.areaSqFt} sqft</span>
        </div>
      </div>
    </Link>
  );
}
