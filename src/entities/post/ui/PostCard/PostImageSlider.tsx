'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowIosBackOutline, ArrowIosForwardOutline } from '@/shared/ui/icons';
import s from './PostCard.module.scss';

type PostImageSliderProps = {
  images: { url: string }[];
  postId: number;
  isExpanded: boolean;
};

export const PostImageSlider = ({
  images,
  postId,
  isExpanded,
}: PostImageSliderProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const imagesCount = images.length;
  const hasMultipleImages = imagesCount > 1;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % imagesCount);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
  };

  return (
    <div
      className={clsx(s.image, isExpanded && s.expanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={s['image-content']}>
        {imagesCount > 0 ? (
          <Link
            href={`/posts/${postId}`}
            scroll={false}
            className={s['image-link']}
          >
            <Image
              src={images[currentSlideIndex].url}
              alt="Post image"
              fill
              sizes="234px"
              className={s['image-element']}
              priority
            />
          </Link>
        ) : (
          <div className={s.placeholder} />
        )}

        {hasMultipleImages && isHovered && (
          <>
            <button
              onClick={prevSlide}
              className={clsx(s['nav-button'], s.left)}
            >
              <ArrowIosBackOutline />
            </button>
            <button
              onClick={nextSlide}
              className={clsx(s['nav-button'], s.right)}
            >
              <ArrowIosForwardOutline />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div
          className={clsx(s['pagination-container'], !isHovered && s.hidden)}
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={clsx(
                s.dot,
                index === currentSlideIndex && s['active-dot'],
              )}
              onClick={() => setCurrentSlideIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
