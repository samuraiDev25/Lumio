import { AspectPreset } from '@/entities/post/model/types/constant';

export type CreatePostStep = 'select' | 'crop' | 'filters' | 'publication';

export type FilterPreset =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'contrast'
  | 'warm'
  | 'cool';

export type CropAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageEditState = {
  crop: { x: number; y: number };
  zoom: number;
  aspect: AspectPreset;
  croppedAreaPixels?: CropAreaPixels;
  filter: FilterPreset;
};

export type ImageEditsMap = Record<string, ImageEditState>;
