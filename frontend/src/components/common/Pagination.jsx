export default function Pagination({ page, totalPages, setPage }) {
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    const delta = 2;
    const left  = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);
    const range = [];
    for (let i = left; i <= right; i++) range.push(i);
    if (left > 2)             range.unshift("...");
    if (left > 1)             range.unshift(1);
    if (right < totalPages - 1) range.push("...");
    if (right < totalPages)   range.push(totalPages);
    return range;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {getPageNumbers().map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="page-ellipsis">···</span>
        ) : (
          <button
            key={p}
            className={`page-btn${page === p ? " active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
