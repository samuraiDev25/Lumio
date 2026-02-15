import { useState } from 'react';

export const useImageNavigation = (
  initialIndex: number,
  totalImages: number,
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  return {
    currentIndex,
    nextImage,
    prevImage,
    selectImage,
  };
};
