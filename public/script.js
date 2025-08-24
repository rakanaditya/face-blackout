const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
}

upload.addEventListener("change", async () => {
  const file = upload.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Deteksi wajah
    const detections = await faceapi.detectAllFaces(img);

    detections.forEach(det => {
      const { x, y, width, height } = det.box;
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, width, height); // Hitamkan wajah
    });
  };
});

loadModels();
