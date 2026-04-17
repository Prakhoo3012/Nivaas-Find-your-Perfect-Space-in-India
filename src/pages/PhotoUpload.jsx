// PhotoUpload.jsx — drop this into your Step 4
import { useState, useCallback, useRef } from "react";

const MAX_FILES = 20;
const MAX_MB   = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUpload({ onFilesChange }) {
  const [photos, setPhotos]     = useState([]); // {file, url, id}
  const [error, setError]       = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef                = useRef(null);

  const processFiles = useCallback((incoming) => {
    setError("");
    const toAdd = [];

    for (const file of incoming) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`"${file.name}" must be JPG, PNG, or WEBP`); continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" exceeds ${MAX_MB} MB`); continue;
      }
      toAdd.push({ file, url: URL.createObjectURL(file), id: crypto.randomUUID() });
    }

    setPhotos((prev) => {
      const remaining = MAX_FILES - prev.length;
      if (toAdd.length > remaining) setError(`Max ${MAX_FILES} photos — keeping first ${remaining}`);
      const next = [...prev, ...toAdd.slice(0, remaining)];
      onFilesChange?.(next.map((p) => p.file)); // lift File[] to parent
      return next;
    });
  }, [onFilesChange]);

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      onFilesChange?.(next.map((p) => p.file));
      return next;
    });
  };

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); };
  const onInputChange = (e) => { processFiles(e.target.files); e.target.value = ""; };

  return (
    <div className="reg-card">
      <h2 className="reg-card-title">Add photos</h2>
      <p className="reg-card-sub">Properties with 5+ photos get 3× more inquiries</p>

      <div
        className={`reg-upload-zone${dragging ? " dragging" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📸</div>
        <div className="reg-upload-text">Click to upload or drag photos here</div>
        <div className="reg-upload-sub">JPG, PNG or WEBP · Max 10 MB each · Up to 20 photos</div>
        <button
          type="button"
          className="reg-btn-primary"
          style={{ marginTop: "1.25rem", display: "inline-flex" }}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >Choose files</button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={onInputChange}
        />
      </div>

      {error && (
        <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>
      )}

      {photos.length > 0 && (
        <>
          <p style={{ fontSize: "0.8rem", color: "var(--stone)", marginTop: "0.75rem" }}>
            {photos.length} / {MAX_FILES} photo{photos.length !== 1 ? "s" : ""} added
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: "8px", marginTop: "0.75rem" }}>
            {photos.map((p) => (
              <div key={p.id} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                <img src={p.url} alt={p.file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.15)", borderRadius: 10, fontSize: "0.8rem", color: "var(--stone)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--charcoal)" }}>Tips for great photos:</strong>
        <ul style={{ marginTop: "0.4rem", paddingLeft: "1.1rem" }}>
          <li>Shoot during daytime for natural lighting</li>
          <li>Include all rooms: bedroom, bathroom, kitchen, living area</li>
          <li>Add exterior / building photo and nearby landmarks</li>
        </ul>
      </div>
    </div>
  );
}
