'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowIosBackOutline, ArrowIosForwardOutline } from '@/shared/ui/icons';
import s from './FeedPostSlider.module.scss';

type Props = {
  images: { url: string }[];
  postId: number;
};

export const FeedPostSlider = ({ images, postId }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const count = images.length;
  if (count === 0) return <div className={s.placeholder} />;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  return (
    <div className={s['slider-root']}>
      <Link href={`/posts/${postId}`} className={s['image-link']}>
        <Image
          src={images[currentIndex].url}
          alt="Post content"
          fill
          priority
          className={s.image}
        />
      </Link>

      {count > 1 && (
        <>
          <button className={`${s['nav-btn']} ${s.prev}`} onClick={prev}>
            <ArrowIosBackOutline width={48} height={48} />
          </button>
          <button className={`${s['nav-btn']} ${s.next}`} onClick={next}>
            <ArrowIosForwardOutline width={48} height={48} />
          </button>

          <div className={s.pagination}>
            {images.map((_, i) => (
              <div
                key={i}
                className={`${s.dot} ${i === currentIndex ? s.active : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
