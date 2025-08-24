const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// URL model face-api.js dari CDN
const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js/models";

// Load semua model sekali di awal
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // model default
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL); // opsi cepat
  console.log("✅ Semua model berhasil dimuat");
}

// Panggil loadModels saat halaman ready
loadModels();

upload.addEventListener('change', async () => {
  const file = upload.files[0];
  if (!file) return;

  // Tampilkan overlay loading setelah user pilih file
  loading.style.display = 'flex';

  try {
    // Buat image dari file
    const img = await faceapi.bufferToImage(file);

    // Set ukuran canvas sesuai gambar
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // --- PILIH DETECTOR ---
    // SSD MobilenetV1 (lebih akurat, lebih berat)
    const detections = await faceapi.detectAllFaces(img);

    // Kalau mau lebih cepat (TinyFaceDetector), pakai ini:
    // const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

    console.log("Wajah terdeteksi:", detections.length);

    // Hitamkan wajah yang terdeteksi
    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });

  } catch (err) {
    console.error("❌ Error saat proses gambar:", err);
    alert("Gagal memproses gambar. Cek console untuk detail.");
  }

  // Sembunyikan overlay setelah proses selesai
  loading.style.display = 'none';
});
