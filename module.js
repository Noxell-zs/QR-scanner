(async function () {
  const video = document.getElementById("video");
  const barcodeResult = document.getElementById("barcodeResult");
  barcodeResult.onclick = () => navigator.clipboard?.writeText(text);

  if (!("BarcodeDetector" in window)) {
    alert("Barcode Detection API is not supported in this browser.");
    return;
  }

  const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "ean_13", "code_128"],
  });

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    video.play();

    video.addEventListener("play", () =>
      setInterval(() => {
        barcodeDetector
          .detect(video)
          .then((barcodes) => {
            if (barcodes.length > 0) {
              barcodeResult.textContent = barcodes[0].rawValue;
            }
          })
          .catch(console.error);
      }, 300)
    );
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert(
      "Unable to access the camera. Please check permissions or run the code on a secure server."
    );
  }
})();
