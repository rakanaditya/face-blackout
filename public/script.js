// Tunggu model face-api.js selesai diload
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(startApp);

function startApp() {
  const imageUpload = document.getElementById('imageUpload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    const img = await loadImage(file);

    // Atur ukuran canvas sesuai gambar
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Deteksi wajah
    const detections = await faceapi.detectAllFaces(img);

    detections.forEach(det => {
      const { x, y, width, height } = det.box;

      // Buat kotak hitam di atas wajah
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });
  });
}

// Fungsi helper untuk load gambar
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
