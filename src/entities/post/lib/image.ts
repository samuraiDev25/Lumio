import { CropAreaPixels } from '@/entities/post/model/types/types';

export function validateImageFile(
  file: File,
  maxSizeBytes: number,
  allowedTypes: readonly string[],
) {
  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size <= maxSizeBytes;
  return isValidType && isValidSize;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CropAreaPixels,
  mimeType: string,
  quality = 0.92,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available');

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}
