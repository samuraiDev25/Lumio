import { FilterPreset } from '@/entities/post/model/types/types';

export const MAX_FILES = 10;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png'] as const;

export const ASPECTS = [
  { label: '1:1', value: 1 },
  { label: '4:5', value: 4 / 5 },
  { label: '16:9', value: 16 / 9 },
] as const;

export type AspectPreset = (typeof ASPECTS)[number]['value'];

export const FILTERS: { label: string; value: FilterPreset; css: string }[] = [
  { label: 'None', value: 'none', css: 'none' },
  { label: 'B&W', value: 'grayscale', css: 'grayscale(1)' },
  { label: 'Sepia', value: 'sepia', css: 'sepia(0.9)' },
  { label: 'Contrast', value: 'contrast', css: 'contrast(1.2)' },
  { label: 'Warm', value: 'warm', css: 'saturate(1.2) brightness(1.05)' },
  { label: 'Cool', value: 'cool', css: 'hue-rotate(180deg) saturate(1.1)' },
];

export const CLOSE_CONFIRM_TEXT =
  'Do you really want to close the creation of a publication? If you close everything will be deleted';

export const INVALID_FILE_TEXT =
  'The photo must be less than 20 Mb and have JPEG or PNG format';
