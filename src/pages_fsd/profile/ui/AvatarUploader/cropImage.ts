import { Area } from 'react-easy-crop';

/**
 * Helper function to load an image from a URL or Base64 string.
 * Creates an HTML Image element and waits for it to fully load.
 *
 * @param {string} src - The image source (URL or Base64).
 * @returns {Promise<HTMLImageElement>} - A promise that resolves with the loaded Image object.
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 'anonymous' is essential to avoid CORS (Tainted Canvas) errors
    // when processing images from external domains (e.g., S3 or Cloudinary).
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
}

/**
 * Crops an image using the HTML5 Canvas API based on coordinates from react-easy-crop.
 *
 * @param {string} imageSrc - The source of the original image.
 * @param {Area} pixelCrop - Coordinates and dimensions (x, y, width, height) in pixels.
 *                          IMPORTANT: Use 'croppedAreaPixels' from the onCropComplete callback.
 * @param {string} [mimeType='image/jpeg'] - The output format of the image.
 * @param {number} [quality=0.92] - Compression quality (ranging from 0 to 1).
 * @returns {Promise<Blob>} - A promise that resolves with the cropped image as a Blob (ready for server upload).
 *
 * @throws {Error} If the 2D canvas context cannot be initialized or Blob generation fails.
 */
export async function getCroppedImageBlob(
  imageSrc: string,
  pixelCrop: Area,
  mimeType: string = 'image/jpeg',
  quality: number = 0.92,
): Promise<Blob> {
  // 1. Wait for the image to be fully loaded into memory
  const image = await loadImage(imageSrc);

  // 2. Create a virtual canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas Context Error: Failed to initialize 2D context');
  }

  // 3. Set canvas dimensions to match the target crop size exactly
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 4. Draw the specific portion of the source image onto the canvas.
  // drawImage parameters: (source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // 5. Export the canvas content into a Blob object for file upload
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error('Canvas Export Error: Failed to generate Blob object'),
          );
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}
