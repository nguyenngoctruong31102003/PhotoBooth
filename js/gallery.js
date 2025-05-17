// Helper to get captured photos and layout from localStorage
function getCapturedPhotos() {
  try {
    const data = JSON.parse(localStorage.getItem("capturedPhotos"));
    if (!data || !Array.isArray(data.photos)) return { photos: [], layout: 1 };
    return data;
  } catch {
    return { photos: [], layout: 1 };
  }
}
function renderGallery() {
  const { photos, layout } = getCapturedPhotos();
  const container = document.getElementById("gallery-photo-layout");
  container.innerHTML = "";
  if (!photos.length) {
    container.innerHTML =
      '<div style="color:#888;font-size:1.1rem;">No photos captured yet.</div>';
    return;
  }
  // Layout logic
  if (layout === 6) {
    // 3x2 grid
    const grid = document.createElement("div");
    grid.className = "gallery-photo-grid";
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gridTemplateRows = "repeat(3, 1fr)";
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "gallery-photo-img";
      grid.appendChild(img);
    });
    container.appendChild(grid);
  } else if (layout === 4) {
    // 2x2 grid
    const grid = document.createElement("div");
    grid.className = "gallery-photo-grid";
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "gallery-photo-img";
      grid.appendChild(img);
    });
    container.appendChild(grid);
  } else if (layout === 3) {
    // 1 column, 3 rows
    const grid = document.createElement("div");
    grid.className = "gallery-photo-grid";
    grid.style.gridTemplateColumns = "1fr";
    grid.style.gridTemplateRows = "repeat(3, 1fr)";
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "gallery-photo-img";
      grid.appendChild(img);
    });
    container.appendChild(grid);
  } else if (layout === 2) {
    // 1 column, 2 rows
    const grid = document.createElement("div");
    grid.className = "gallery-photo-grid";
    grid.style.gridTemplateColumns = "1fr";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "gallery-photo-img";
      grid.appendChild(img);
    });
    container.appendChild(grid);
  } else {
    // fallback: single column
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "gallery-photo-img";
      container.appendChild(img);
    });
  }
}
document.addEventListener("DOMContentLoaded", renderGallery);
