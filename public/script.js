const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const loading = document.getElementById('loading');

upload.addEventListener('change', async () => {
  loading.style.display = 'flex'; // tampilkan loading

  const file = upload.files[0];
  const img = await faceapi.bufferToImage(file);

  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // proses deteksi wajah
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  const detections = await faceapi.detectAllFaces(img);

  detections.forEach(det => {
    const { x, y, width, height } = det.box;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
  });

  loading.style.display = 'none'; // sembunyikan loading setelah selesai
});
