'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowIosBackOutline, ArrowIosForwardOutline } from '@/shared/ui/icons';
import { Post } from '@/features/posts/api/postApi.types';
import { getRelativeTime } from '@/shared/lib';
import s from './PostCard.module.scss';

type PostCardProps = {
  post: Post;
};

// Лимиты подобраны для Pixel Perfect верстки:
// TRUNCATE_LENGTH (95) заполняет ровно 4 строки (высота 96px)
// EXPANDED_TRUNCATE_LENGTH (175) заполняет 8 строк (высота 196px) при уменьшенном фото
const TRUNCATE_LENGTH = 95;
const EXPANDED_TRUNCATE_LENGTH = 175;
const MIN_CONTENT_LENGTH_FOR_TOGGLE = 96;

/**
 * Компонент карточки поста.
 *
 * Особенности:
 * 1. Интерактивный слайдер изображений с навигацией при ховере.
 * 2. Умное сокращение текста:
 *    - В обычном виде: 4 строки (Pixel Perfect под высоту 391px).
 *    - В развернутом виде: до 8 строк с автоматическим уменьшением высоты фото.
 * 3. Динамический расчет времени (Relative Time).
 * 4. Предусмотрен placeholder для постов без изображений.
 */
export const PostCard = ({ post }: PostCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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
          {images.length > 0 ? (
            <img
              src={images[currentSlideIndex].url}
              alt={
                description
                  ? `Post: ${description.substring(0, 20)}...`
                  : 'User post image'
              }
              className={s['image-element']}
            />
          ) : (
            <div className={s.placeholder} aria-label="No image available" />
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
              onClick={() => setExpanded(!expanded)}
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
