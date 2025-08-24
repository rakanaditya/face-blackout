const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// Load model sekali saat halaman dibuka
async function loadModels() {
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js/models";
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    console.log("✅ Model berhasil diload");
  } catch (err) {
    console.error("❌ Gagal load model:", err);
    alert("Model wajah gagal dimuat. Cek koneksi internet atau folder /models.");
  }
}

window.addEventListener('DOMContentLoaded', loadModels);

upload.addEventListener('change', async () => {
  const file = upload.files[0];
  if (!file) return;

  // Tampilkan overlay loading
  loading.style.display = 'flex';

  try {
    // Convert file jadi image
    const img = await faceapi.bufferToImage(file);

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Deteksi wajah
    const detections = await faceapi.detectAllFaces(img);

    console.log("Jumlah wajah terdeteksi:", detections.length);

    if (detections.length === 0) {
      alert("⚠️ Tidak ada wajah terdeteksi di gambar ini.");
    }

    // Hitamkan wajah
    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });

  } catch (err) {
    console.error("❌ Gagal memproses gambar:", err);
    alert("Terjadi error saat memproses gambar. Coba file lain atau cek console log.");
  } finally {
    // Apapun hasilnya, overlay ditutup
    loading.style.display = 'none';
  }
});
