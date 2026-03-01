'use client';

import clsx from 'clsx';
import s from '../CreatePostDialog.module.scss';

import { ImageListType } from 'react-images-uploading';
import { fileKey } from '../../../lib/keys';
import { FilterPreset, ImageEditsMap } from '@/entities/post/model/types/types';
import { FILTERS } from '@/entities/post/model/types/constant';

type Props = {
  images: ImageListType;
  edits: ImageEditsMap;
  setEdits: (next: ImageEditsMap) => void;

  activeIndex: number;
  setActiveIndex: (i: number) => void;

  onBack: () => void;
  onNext: () => void;
};

export const StepFilters = ({
  images,
  edits,
  setEdits,
  activeIndex,
  setActiveIndex,
  onBack,
  onNext,
}: Props) => {
  const active = images[activeIndex];
  const k = active?.file ? fileKey(active.file) : '';
  const activeEdit = k ? edits[k] : null;
  const css = activeEdit
    ? (FILTERS.find((f) => f.value === activeEdit.filter)?.css ?? 'none')
    : 'none';

  if (!active || !activeEdit) return null;

  const filterHandler = (f: {
    label: string;
    value: FilterPreset;
    css: string;
  }) => {
    setEdits({
      ...edits,
      [k]: { ...activeEdit, filter: f.value },
    });
  };

  return (
    <>
      <div className={s.headerBar}>
        <button
          className={s.iconTopBtn}
          type="button"
          onClick={onBack}
          aria-label="Back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={s.headerTitle}>Filters</div>

        <button className={s.linkBtn} type="button" onClick={onNext}>
          Next
        </button>
      </div>

      <div className={clsx(s.body, s.filtersLayout)}>
        <div className={s.stageWrap}>
          <div className={s.stage}>
            <img
              src={active.data_url}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: css,
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  className={clsx(s.navArrow, s.navLeft)}
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      activeIndex === 0 ? images.length - 1 : activeIndex - 1,
                    )
                  }
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  className={clsx(s.navArrow, s.navRight)}
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      activeIndex === images.length - 1 ? 0 : activeIndex + 1,
                    )
                  }
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className={s.dots}>
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        s.dot,
                        idx === activeIndex && s.dotActive,
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={s.filtersPanel}>
          <div className={s.filterGrid}>
            {FILTERS.map((f) => (
              <div
                key={f.value}
                className={s.filterItem}
                role="button"
                tabIndex={0}
                onClick={() => filterHandler(f)}
              >
                <div
                  className={clsx(
                    s.filterThumb,
                    activeEdit.filter === f.value && s.filterThumbActive,
                  )}
                >
                  <img
                    src={active.data_url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: f.css,
                    }}
                  />
                </div>
                <div className={s.filterLabel}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
