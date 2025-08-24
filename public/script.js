// Tunggu model face-api.js selesai dimuat dari folder lokal /models
Promise.all([
  faceapi.nets.ssd_mobilenetv1_model-shard1.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startApp);

function startApp() {
  const imageUpload = document.getElementById('imageUpload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    const img = await loadImage(file);

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const detections = await faceapi.detectAllFaces(img);

    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height);
    });
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
