'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowIosBackOutline, ArrowIosForwardOutline } from '@/shared/ui/icons';
import { Post } from '@/features/posts/api/postApi.types';
import { getRelativeTime } from '@/shared/lib';
import s from './PostCard.module.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type PostCardProps = {
  post: Post;
};

// Truncation limits optimized for Pixel Perfect layout:
// TRUNCATE_LENGTH (95) fills exactly 4 lines (96px height)
// EXPANDED_TRUNCATE_LENGTH (175) fills 8 lines (196px height) when image is shrunk
const TRUNCATE_LENGTH = 95;
const EXPANDED_TRUNCATE_LENGTH = 175;
const MIN_CONTENT_LENGTH_FOR_TOGGLE = 96;

/**
 * Post card component.
 *
 * Features:
 * 1. Interactive Image Slider: Navigation arrows appear on hover.
 * 2. Smart Text Truncation:
 *    - Default view: 4 lines (Pixel Perfect for 391px height).
 *    - Expanded view: Up to 8 lines with automatic image height reduction.
 * 3. Dynamic Relative Time: Uses getRelativeTime utility.
 * 4. Fallback State: Includes a placeholder for posts without images.
 */
export const PostCard = ({ post }: PostCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const router = useRouter();

  const images = post.postFiles || [];
  const description = post.description || '';

  const imagesCount = images.length;
  const hasMultipleImages = imagesCount > 1;

  const shouldShowToggle = description.length > MIN_CONTENT_LENGTH_FOR_TOGGLE;

  const getDisplayText = () => {
    if (expanded) {
      return description.length > EXPANDED_TRUNCATE_LENGTH
        ? description.substring(0, EXPANDED_TRUNCATE_LENGTH) + '...'
        : description;
    }
    return description.length > TRUNCATE_LENGTH
      ? description.substring(0, TRUNCATE_LENGTH) + '...'
      : description;
  };

  const nextSlide = () => {
    if (hasMultipleImages) {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % imagesCount);
    }
  };

  const prevSlide = () => {
    if (hasMultipleImages) {
      setCurrentSlideIndex(
        (prevIndex) => (prevIndex - 1 + imagesCount) % imagesCount,
      );
    }
  };
  return (
    <div className={s.card}>
      <div
        className={clsx(s.image, expanded && s.expanded)}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <div className={s['image-content']}>
          {images.length > 0 && images[currentSlideIndex]?.url ? (
            <Image
              src={images[currentSlideIndex].url}
              alt="User posts image"
              width={234}
              height={200}
              className={s['image-element']}
              onClick={() => router.push(`/posts/${post.id}`)}
              priority={true}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={s.placeholder} aria-label="No image available">
              {/* Empty div rendered with background color from CSS */}
            </div>
          )}

          {hasMultipleImages && isImageHovered && (
            <>
              <button
                onClick={prevSlide}
                className={clsx(s['nav-button'], s.left)}
                aria-label="Previous image"
              >
                <ArrowIosBackOutline />
              </button>
              <button
                onClick={nextSlide}
                className={clsx(s['nav-button'], s.right)}
                aria-label="Next image"
              >
                <ArrowIosForwardOutline />
              </button>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div
            className={clsx(
              s['pagination-container'],
              !isImageHovered && s.hidden,
            )}
          >
            {images.map((_, index) => (
              <button
                key={index}
                className={clsx(
                  s.dot,
                  index === currentSlideIndex && s['active-dot'],
                )}
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentSlideIndex}
              />
            ))}
          </div>
        )}
      </div>
      <div className={s.content}>
        <div className={s['user-row']}>
          <div className={s.avatar}>U</div>
          <div className={s['user-name']}>User {post.userId}</div>
        </div>

        <div className={s.time}>{getRelativeTime(post.createdAt, 'en')}</div>

        <div className={clsx(s['text-container'], expanded && s.expanded)}>
          <span className={s.text}>{getDisplayText()}</span>

          {shouldShowToggle && (
            <button
              className={s['show-more']}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              aria-label={expanded ? 'Hide full text' : 'Show more text'}
              aria-expanded={expanded}
            >
              {expanded ? 'Hide' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
