export async function convertPngToJpg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context."));
          return;
        }

        // Draw image onto canvas. Fill white background for cases where PNG has transparency.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Export as Data URL encoded JPEG representation.
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("Failed to parse image file."));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    reader.readAsDataURL(file);
  });
}
