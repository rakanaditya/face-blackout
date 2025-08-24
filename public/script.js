const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// Muat model sekali di awal
async function loadModels() {
  try {
    // Ambil dari folder lokal /models
    const MODEL_URL = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    console.log("✅ Model berhasil dimuat");
  } catch (err) {
    console.error("❌ Gagal load model:", err);
  }
}


upload.addEventListener('change', async () => {
  const file = upload.files[0];
  if (!file) return;

  loading.style.display = 'flex';

  try {
    const img = await faceapi.bufferToImage(file);

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const detections = await faceapi.detectAllFaces(img);

    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });

    console.log("✅ Wajah berhasil diproses:", detections.length);
  } catch (err) {
    console.error("❌ Gagal memproses gambar:", err);
  }

  loading.style.display = 'none';
});
