'use client';

import { ArrowIosBack, ArrowIosForward } from '@/shared/ui/icons';
import s from './PostImage.module.scss';

type Props = {
  images: { url: string }[];
  currentIndex: number;
  onNextAction: () => void;
  onPrevAction: () => void;
  onSelectImageAction: (index: number) => void;
};

export const PostImage = ({
  images,
  currentIndex,
  onNextAction,
  onPrevAction,
  onSelectImageAction,
}: Props) => {
  const hasMultipleImages = images.length > 1;

  return (
    <div className={s.imageSection}>
      {images.length > 0 && (
        <img
          src={images[currentIndex]?.url || ''}
          alt="Post image"
          className={s.postImage}
        />
      )}

      {hasMultipleImages && currentIndex > 0 && (
        <button onClick={onPrevAction} className={s.navButtonPrev}>
          <ArrowIosBack />
        </button>
      )}

      {hasMultipleImages && currentIndex < images.length - 1 && (
        <button onClick={onNextAction} className={s.navButtonNext}>
          <ArrowIosForward />
        </button>
      )}

      {hasMultipleImages && (
        <div className={s.pagination}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectImageAction(idx)}
              className={`${s.paginationDot} ${
                idx === currentIndex ? s.paginationDotActive : ''
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
