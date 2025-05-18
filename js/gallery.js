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

  // Frame color selector UI
  let frameColor = "#fff";
  let colorPicker = document.getElementById("frame-color-picker");
  let colorSwatchContainer = document.getElementById("frame-color-swatches");
  let label = document.getElementById("frame-color-label");
  if (!label) {
    label = document.createElement("label");
    label.id = "frame-color-label";
    label.textContent = "Màu khung:";
    label.style.fontWeight = "600";
    label.style.marginRight = "12px";
    label.style.fontSize = "1.1rem";
  }
  if (!colorSwatchContainer) {
    colorSwatchContainer = document.createElement("div");
    colorSwatchContainer.id = "frame-color-swatches";
    colorSwatchContainer.style.display = "flex";
    colorSwatchContainer.style.gap = "10px";
    colorSwatchContainer.style.alignItems = "center";
    // Swatch colors
    const swatchColors = [
      { name: "Hồng", color: "#ff85a1" },
      { name: "Xanh", color: "#CAF0F8" },
      { name: "Vàng", color: "#FFF8A5" },
      { name: "Matcha", color: "#B7E5B4" },
      { name: "Tím", color: "#c19ee0" },
      { name: "Nâu", color: "#DDBEA9" },
    ];
    swatchColors.forEach(({ name, color }) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.title = name;
      swatch.style.background = color;
      swatch.style.width = "32px";
      swatch.style.height = "32px";
      swatch.style.border = "2px solid #ccc";
      swatch.style.borderRadius = "8px";
      swatch.style.cursor = "pointer";
      swatch.style.outline = "none";
      swatch.style.transition = "border 0.2s";
      swatch.onmouseenter = function () {
        swatch.style.border = "2px solid #222";
      };
      swatch.onmouseleave = function () {
        swatch.style.border = "2px solid #ccc";
      };
      swatch.onclick = function () {
        colorPicker.value = color;
        colorPicker.dispatchEvent(new Event("input"));
      };
      colorSwatchContainer.appendChild(swatch);
    });
  }
  if (!colorPicker) {
    colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.id = "frame-color-picker";
    colorPicker.value = "#ffffff";
    colorPicker.style.width = "38px";
    colorPicker.style.height = "38px";
    colorPicker.style.border = "none";
    colorPicker.style.cursor = "pointer";
    colorPicker.title = "Chọn màu khung";
  }
  // Arrange label, swatches, and color picker in a row
  let colorRow = document.getElementById("frame-color-row");
  if (!colorRow) {
    colorRow = document.createElement("div");
    colorRow.id = "frame-color-row";
    colorRow.style.display = "flex";
    colorRow.style.alignItems = "center";
    colorRow.style.gap = "18px";
    colorRow.style.margin = "16px 0 12px 0";
    colorRow.appendChild(label);
    colorRow.appendChild(colorSwatchContainer);
    colorRow.appendChild(colorPicker);
    container.parentNode.insertBefore(colorRow, container);
  }

  // Render preview with frame
  const preview = document.createElement("div");
  preview.className = "photobooth-frame-preview";
  preview.style.background = colorPicker.value;
  preview.style.padding = "18px 18px 8px 18px";
  preview.style.borderRadius = "12px";
  preview.style.display = "inline-block";
  preview.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
  preview.style.marginBottom = "18px";
  preview.style.position = "relative";

  // Layout logic for preview
  let gridCols = 1,
    gridRows = photos.length;
  let gapPx = 24;
  if (layout === 6) {
    gridCols = 2;
    gridRows = 3;
    gapPx = 24;
  } else if (layout === 4) {
    gridCols = 2;
    gridRows = 2;
    gapPx = 24;
  } else if (layout === 3) {
    gridCols = 1;
    gridRows = 3;
    gapPx = 24;
  } else if (layout === 2) {
    gridCols = 1;
    gridRows = 2;
    gapPx = 24;
  }

  const grid = document.createElement("div");
  grid.className = "gallery-photo-grid";
  grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
  grid.style.background = "transparent";
  grid.style.boxShadow = "none";
  grid.style.padding = "0";
  grid.style.gap = gapPx + "px";
  photos.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "gallery-photo-img";
    grid.appendChild(img);
  });
  preview.appendChild(grid);

  // Caption
  let caption = document.createElement("div");
  caption.textContent = "photobooth";
  caption.style.textAlign = "center";
  caption.style.fontWeight = "bold";
  caption.style.fontSize = "1.1rem";
  caption.style.marginTop = "10px";
  preview.appendChild(caption);

  container.appendChild(preview);

  // Canvas for download
  function drawToCanvasAndDownload(bgColor) {
    // Assume all images are the same size
    const tempImg = new window.Image();
    tempImg.src = photos[0];
    tempImg.onload = function () {
      // Set output size based on layout
      let canvasW = 592,
        canvasH = 1352;
      let gridCols = 1,
        gridRows = photos.length,
        gapPx = 24;
      if (layout === 6) {
        canvasW = 900;
        canvasH = 1352;
        gridCols = 2;
        gridRows = 3;
        gapPx = 24;
      } else if (layout === 4) {
        gridCols = 2;
        gridRows = 2;
        gapPx = 24;
      } else if (layout === 3) {
        gridCols = 1;
        gridRows = 3;
        gapPx = 24;
      } else if (layout === 2) {
        gridCols = 1;
        gridRows = 2;
        gapPx = 24;
      }
      // Calculate image size and padding
      const captionH = 60;
      const framePadX = 40;
      const framePadY = 40;
      // Calculate total gap space
      const totalGapX = gapPx * (gridCols - 1);
      const totalGapY = gapPx * (gridRows - 1);
      const gridW = canvasW - framePadX * 2;
      const gridH = canvasH - framePadY * 2 - captionH;
      const imgW = Math.floor((gridW - totalGapX) / gridCols);
      const imgH = Math.floor((gridH - totalGapY) / gridRows);
      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");
      // Draw frame background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
      // Draw images
      let loaded = 0;
      for (let i = 0; i < photos.length; i++) {
        const img = new window.Image();
        img.src = photos[i];
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        img.onload = function () {
          ctx.drawImage(
            img,
            framePadX + col * (imgW + gapPx),
            framePadY + row * (imgH + gapPx),
            imgW,
            imgH
          );
          loaded++;
          if (loaded === photos.length) {
            // Caption
            ctx.font = "bold 36px Poppins, Arial, sans-serif";
            ctx.fillStyle = "#111";
            ctx.textAlign = "center";
            ctx.fillText(
              "Photobooth",
              canvasW / 2,
              canvasH - captionH / 2 + 10
            );
            // Download
            const link = document.createElement("a");
            link.download = "photobooth.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
          }
        };
      }
    };
  }

  // Download button
  let btn = document.getElementById("download-photo-btn");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "download-photo-btn";
    btn.textContent = "Tải ảnh về máy";
    btn.style.marginTop = "24px";
    btn.style.padding = "12px 32px";
    btn.style.borderRadius = "24px";
    btn.style.border = "2px solid #222";
    btn.style.fontSize = "1.1rem";
    btn.style.fontWeight = "600";
    btn.style.cursor = "pointer";
    btn.onclick = function () {
      drawToCanvasAndDownload(colorPicker.value);
    };
    container.parentNode.appendChild(btn);
  } else {
    btn.onclick = function () {
      drawToCanvasAndDownload(colorPicker.value);
    };
  }

  // Update preview frame color on change
  colorPicker.oninput = function () {
    preview.style.background = colorPicker.value;
  };
}
document.addEventListener("DOMContentLoaded", renderGallery);
