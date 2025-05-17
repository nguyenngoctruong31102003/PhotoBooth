// Helper to capture a frame from the video
function capturePhoto(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

// Display captured photo in the right column
function displayPhoto(src) {
  const gallery = document.getElementById("photo-gallery");
  const img = document.createElement("img");
  img.src = src;
  img.className = "captured-photo";
  gallery.appendChild(img);
}

// Arrange gallery as a right column
function setupGalleryColumn() {
  const gallery = document.getElementById("photo-gallery");
  gallery.style.display = "flex";
  gallery.style.flexDirection = "column";
  gallery.style.gap = "20px";
  gallery.style.justifyContent = "center";
  gallery.style.alignItems = "center";
  gallery.innerHTML = "";
}

function renderPhotoSlots(count) {
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML = "";
  if (count === 6) {
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = "repeat(2, 1fr)";
    gallery.style.gridTemplateRows = "repeat(3, 1fr)";
    gallery.style.gap = "18px";
    gallery.style.justifyItems = "center";
    gallery.style.alignItems = "center";
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement("div");
      slot.className = "photo-slot";
      gallery.appendChild(slot);
    }
  } else if (count === 4) {
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = "repeat(2, 1fr)";
    gallery.style.gridTemplateRows = "repeat(2, 1fr)";
    gallery.style.gap = "20px";
    gallery.style.justifyItems = "center";
    gallery.style.alignItems = "center";
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement("div");
      slot.className = "photo-slot";
      gallery.appendChild(slot);
    }
  } else if (count === 3) {
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = "repeat(1, 1fr)";
    gallery.style.gridTemplateRows = "repeat(3, 1fr)";
    gallery.style.gap = "20px";
    gallery.style.justifyItems = "center";
    gallery.style.alignItems = "center";
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "photo-slot";
      gallery.appendChild(slot);
    }
  } else if (count === 2) {
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = "repeat(1, 1fr)";
    gallery.style.gridTemplateRows = "repeat(2, 1fr)";
    gallery.style.gap = "20px";
    gallery.style.justifyItems = "center";
    gallery.style.alignItems = "center";
    for (let i = 0; i < 2; i++) {
      const slot = document.createElement("div");
      slot.className = "photo-slot";
      gallery.appendChild(slot);
    }
  } else {
    gallery.style.display = "flex";
    gallery.style.flexDirection = "column";
    gallery.style.gap = "20px";
    gallery.style.justifyContent = "center";
    gallery.style.alignItems = "center";
    for (let i = 0; i < count; i++) {
      const slot = document.createElement("div");
      slot.className = "photo-slot";
      gallery.appendChild(slot);
    }
  }
}

function updatePhotoSlots() {
  const count = parseInt(
    document.getElementById("photo-count-select").value,
    10
  );
  renderPhotoSlots(count);
}

let isCapturing = false;
let stream = null;
let cameraReady = false;

async function startCamera(video) {
  if (stream) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    cameraReady = true;
  } catch (err) {
    alert("Unable to access camera.");
    cameraReady = false;
  }
}

// Add retake logic for a specific slot
async function retakePhotoAt(slotIndex) {
  if (isCapturing) return;
  isCapturing = true;
  const video = document.getElementById("video");
  const countdownEl = document.querySelector(".countdown");
  const delaySelect = document.getElementById("delay-select");
  const delay = parseInt(delaySelect.value, 10);
  const photoGallery = document.getElementById("photo-gallery");
  const startBtn = document.getElementById("start-capturing");

  // Start camera if not ready
  if (!cameraReady) {
    await startCamera(video);
    if (!cameraReady) {
      isCapturing = false;
      return;
    }
  }

  countdownEl.style.display = "block";
  countdownEl.style.fontSize = "3rem";
  countdownEl.style.fontWeight = "bold";
  countdownEl.style.fontFamily = "'Poppins', Arial, sans-serif";
  countdownEl.style.textAlign = "center";
  countdownEl.style.color = "#111";
  countdownEl.style.textShadow =
    "2px 4px 12px #fff, 0 2px 0 #000, 0 4px 12px rgba(0,0,0,0.10)";

  // Disable controls during retake
  document.getElementById("delay-select").disabled = true;
  document.getElementById("photo-count-select").disabled = true;
  startBtn.disabled = true;

  // Countdown
  for (let t = delay; t > 0; t--) {
    countdownEl.textContent = t;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 1000));
  }
  countdownEl.textContent = "";
  const photo = capturePhoto(video);
  // Replace photo in the correct slot
  const slot = photoGallery.children[slotIndex];
  slot.innerHTML = "";
  const img = document.createElement("img");
  img.src = photo;
  img.className = "captured-photo";
  slot.appendChild(img);
  // Add camera icon overlay for retake UI
  const icon = document.createElement("i");
  icon.className = "bx bx-camera retake-icon";
  slot.appendChild(icon);
  slot.onmouseenter = function () {
    icon.style.opacity = 1;
  };
  slot.onmouseleave = function () {
    icon.style.opacity = 0;
  };
  slot.onclick = function () {
    retakePhotoAt(slotIndex);
  };
  icon.style.opacity = 0;

  countdownEl.style.display = "none";
  document.getElementById("delay-select").disabled = false;
  document.getElementById("photo-count-select").disabled = false;
  startBtn.disabled = false;
  isCapturing = false;

  // Turn off camera after retake
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    stream = null;
    cameraReady = false;
    video.srcObject = null;
  }
}

// Main capture logic
async function startCapturing() {
  if (isCapturing) return;
  const video = document.getElementById("video");
  const startBtn = document.getElementById("start-capturing");
  if (!cameraReady) {
    startBtn.disabled = true;
    await startCamera(video);
    startBtn.disabled = false;
    if (!cameraReady) return;
    // After camera is ready, change button text and wait for next click
    startBtn.textContent = "Chụp Ảnh";
    startBtn.onclick = startCapturing;
    return;
  }
  isCapturing = true;
  const photoCount = parseInt(
    document.getElementById("photo-count-select").value,
    10
  );
  setupGalleryColumn();
  renderPhotoSlots(photoCount);
  const countdownEl = document.querySelector(".countdown");
  const delaySelect = document.getElementById("delay-select");
  const delay = parseInt(delaySelect.value, 10);
  const photoGallery = document.getElementById("photo-gallery");
  countdownEl.style.display = "block";
  countdownEl.style.fontSize = "3rem";
  countdownEl.style.fontWeight = "bold";
  countdownEl.style.fontFamily = "'Poppins', Arial, sans-serif";
  countdownEl.style.textAlign = "center";
  // countdownEl.style.margin = "30px 0 0 0";
  countdownEl.style.color = "#111";
  countdownEl.style.textShadow =
    "2px 4px 12px #fff, 0 2px 0 #000, 0 4px 12px rgba(0,0,0,0.10)";

  // Disable selects during capture
  document.getElementById("delay-select").disabled = true;
  document.getElementById("photo-count-select").disabled = true;
  startBtn.disabled = true;

  for (let i = 0; i < photoCount; i++) {
    for (let t = delay; t > 0; t--) {
      countdownEl.textContent = t;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
    countdownEl.textContent = "";
    const photo = capturePhoto(video);
    // Place photo in the correct slot
    const slot = photoGallery.children[i];
    slot.innerHTML = "";
    const img = document.createElement("img");
    img.src = photo;
    img.className = "captured-photo";
    slot.appendChild(img);
    // Add camera icon overlay for retake UI
    const icon = document.createElement("i");
    icon.className = "bx bx-camera retake-icon";
    slot.appendChild(icon);
    // Add retake event listener
    slot.onmouseenter = function () {
      icon.style.opacity = 1;
    };
    slot.onmouseleave = function () {
      icon.style.opacity = 0;
    };
    slot.onclick = function () {
      retakePhotoAt(i);
    };
    icon.style.opacity = 0;
    if (i < photoCount - 1) await new Promise((r) => setTimeout(r, 400));
  }
  countdownEl.style.display = "none";
  // Re-enable selects after capture
  document.getElementById("delay-select").disabled = false;
  document.getElementById("photo-count-select").disabled = false;
  isCapturing = false;

  // Turn off camera after capturing
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    stream = null;
    cameraReady = false;
    video.srcObject = null;
  }

  // Change button to 'Continue' and link to Gallery
  startBtn.textContent = "Tiếp tục";
  startBtn.disabled = false;
  startBtn.onclick = function () {
    // Save captured photos and layout to localStorage
    const capturedPhotos = [];
    for (let i = 0; i < photoCount; i++) {
      const slot = photoGallery.children[i];
      const img = slot.querySelector("img");
      if (img) capturedPhotos.push(img.src);
    }
    localStorage.setItem(
      "capturedPhotos",
      JSON.stringify({ photos: capturedPhotos, layout: photoCount })
    );
    window.location.href = "gallery.html";
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Do NOT start webcam on load
  // Only bind capture button
  const startBtn = document.getElementById("start-capturing");
  startBtn.textContent = "Bắt Đầu";
  startBtn.onclick = startCapturing;
  document
    .getElementById("photo-count-select")
    .addEventListener("change", updatePhotoSlots);
  updatePhotoSlots();
});

// Add Boxicons CDN to the page if not present
if (!document.querySelector('link[href*="boxicons.min.css"]')) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
  document.head.appendChild(link);
}
