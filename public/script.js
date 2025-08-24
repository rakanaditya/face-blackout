const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const statusText = document.getElementById("status");

// 🔹 Load Models
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models")
]).then(startVideo).catch(err => {
  statusText.innerText = "❌ Gagal memuat model: " + err;
});

// 🔹 Start Video
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
      statusText.innerText = "✅ Model siap. Kamera aktif.";
    })
    .catch(err => {
      statusText.innerText = "⚠️ Akses kamera ditolak!";
      console.error(err);
    });
}

// 🔹 Detect Faces
video.addEventListener("play", () => {
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(overlay, displaySize);

  setInterval(async () => {
    try {
      const detections = await faceapi.detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceExpressions();

      const resized = faceapi.resizeResults(detections, displaySize);

      overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);

      faceapi.draw.drawDetections(overlay, resized);
      faceapi.draw.drawFaceLandmarks(overlay, resized);
      faceapi.draw.drawFaceExpressions(overlay, resized);

      if (detections.length > 0) {
        statusText.innerText = `😀 Wajah terdeteksi (${detections.length})`;
      } else {
        statusText.innerText = "😐 Tidak ada wajah terdeteksi";
      }
    } catch (err) {
      console.error(err);
      statusText.innerText = "⚠️ Error deteksi wajah.";
    }
  }, 200);
});
