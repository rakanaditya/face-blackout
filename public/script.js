const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// Pastikan model sudah diload sebelum dipakai
async function loadModels() {
  try {
    const MODEL_URL = "/models"; // folder model di public/models
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL); 
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL); 
    console.log("✅ Semua model berhasil dimuat");
  } catch (err) {
    console.error("❌ Gagal load model:", err);
  }
}

async function handleImageUpload(file) {
  try {
    const img = await faceapi.bufferToImage(file);

    // Resize canvas sesuai ukuran gambar
    canvas.width = img.width;
    canvas.height = img.height;

    // Gambar foto asli
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Jalankan deteksi wajah
    const detections = await faceapi.detectAllFaces(img);

    // Hitamkan setiap wajah
    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });

    console.log(`✅ Wajah berhasil diproses: ${detections.length} terdeteksi`);
  } catch (err) {
    console.error("❌ Error saat memproses gambar:", err);
    alert("Gagal memproses gambar. Coba lagi dengan foto lain.");
  }
}

// Tunggu model selesai dulu baru aktifkan upload
loadModels().then(() => {
  upload.addEventListener('change', async () => {
    const file = upload.files[0];
    if (!file) return;

    loading.style.display = 'flex'; // tampilkan overlay
    await handleImageUpload(file);
    loading.style.display = 'none'; // sembunyikan overlay
  });
});
