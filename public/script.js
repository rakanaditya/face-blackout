const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// Load model dulu di awal (sekali saja)
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
}
loadModels();

upload.addEventListener('change', async () => {
  const file = upload.files[0];
  if (!file) return;

  // Tampilkan overlay loading setelah user pilih file
  loading.style.display = 'flex';

  // Buat image dari file
  const img = await faceapi.bufferToImage(file);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Deteksi wajah
  const detections = await faceapi.detectAllFaces(img);

  // Hitamkan wajah yang terdeteksi
  detections.forEach(det => {
    const { x, y, width, height } = det.box;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
  });

  // Sembunyikan overlay setelah proses selesai
  loading.style.display = 'none';
});
