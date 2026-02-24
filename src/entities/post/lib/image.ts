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

export async function getCroppedFilteredImageBlob(
  dataUrl: string,
  crop: CropAreaPixels | null | undefined,
  mimeType: string,
  cssFilter: string, // например: 'grayscale(1)' или 'none'
): Promise<Blob> {
  const image = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  const sx = crop?.x ?? 0;
  const sy = crop?.y ?? 0;
  const sWidth = crop?.width ?? image.width;
  const sHeight = crop?.height ?? image.height;

  canvas.width = Math.max(1, Math.round(sWidth));
  canvas.height = Math.max(1, Math.round(sHeight));

  ctx.filter = cssFilter && cssFilter !== 'none' ? cssFilter : 'none';

  ctx.drawImage(
    image,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  ctx.filter = 'none';

  const quality =
    mimeType === 'image/jpeg' || mimeType === 'image/webp' ? 0.92 : undefined;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
      mimeType,
      quality,
    );
  });

  return blob;
}
