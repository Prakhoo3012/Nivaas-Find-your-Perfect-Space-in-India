return (
  <div className="home-root">
    {/* Navbar */}
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-brand">
        <div className="nav-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span className="nav-logo-name">Nivaas</span>
      </div>

      <div className="nav-links">
        <button className="nav-link active">Browse</button>
        <button className="nav-link" onClick={onSearch}>How it works</button>
        <button className="nav-link" onClick={() => navigate("dashboard")}>Owner dashboard</button>
      </div>

      <div className="nav-right">
        <button className="btn-ghost" onClick={() => navigate("auth")}>Sign in</button>
        <button className="btn-cta" onClick={() => navigate("auth")}>Get started</button>
      </div>
    </nav>

    {/* 🔥 GLOBAL LOADING */}
    {loading ? (
      <div className="text-center py-10">Loading listings...</div>
    ) : (
      <>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">

            {/* LEFT */}
            <div>
              <h1 className="hero-headline">Find your perfect home</h1>
            </div>

            {/* RIGHT */}
            <div className="hero-right">
              {filtered.length > 0 && (
                <div className="hero-card-float hcf-main">
                  <div className="hcf-img">
                    <span className="hcf-tag">
                      {filtered[0]?.propertyType}
                    </span>
                  </div>

                  <div className="hcf-title">
                    {filtered[0]?.title}
                  </div>

                  <div className="hcf-loc">
                    {filtered[0]?.location?.city},{" "}
                    {filtered[0]?.location?.state}
                  </div>

                  <div className="hcf-price">
                    ₹ {filtered[0]?.pricing?.basePrice}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <div ref={listingsRef} style={{ padding: "0 4rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>

            {/* HEADER */}
            <div className="listings-header">
              <h2>All listings</h2>
              <p>
                {filtered.length} properties found
              </p>
            </div>

            {/* 🔥 EMPTY STATE */}
            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>No listings found</p>
              </div>
            ) : (
              <div className="listings-grid">
                {filtered.map((l, i) => (
                  <PropertyCard
                    key={l._id}
                    listing={l}
                    idx={i}
                    wishlist={wishlist.includes(l._id)}
                    toggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);