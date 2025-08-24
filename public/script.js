const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights");
}

upload.addEventListener("change", async () => {
  const file = upload.files[0];
  if (!file) return;

  const img = await createImageBitmap(file);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // deteksi wajah
  const detections = await faceapi.detectAllFaces(
    img,
    new faceapi.TinyFaceDetectorOptions()
  );

  // hitamkan wajah
  detections.forEach(det => {
    const { x, y, width, height } = det.box;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
  });
});

// jalankan awal
loadModels();
