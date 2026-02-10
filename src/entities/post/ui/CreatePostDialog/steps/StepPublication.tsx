'use client';

import clsx from 'clsx';
import s from '../CreatePostDialog.module.scss';
import { TextArea } from '@/shared/ui/textArea/TextArea';

import { ImageListType } from 'react-images-uploading';
import { fileKey } from '../../../lib/keys';
import { ImageEditsMap } from '@/entities/post/model/types/types';
import { FILTERS } from '@/entities/post/model/types/constant';

type Props = {
  images: ImageListType;
  edits: ImageEditsMap;

  activeIndex: number;
  setActiveIndex: (i: number) => void;

  description: string;
  setDescription: (v: string) => void;

  profileName?: string;
  avatarUrl?: string;

  isLoading: boolean;

  onBack: () => void;
  onPublish: () => void;
};

export const StepPublication = ({
  images,
  edits,
  activeIndex,
  setActiveIndex,
  description,
  setDescription,
  profileName = 'URLProfile',
  avatarUrl,
  isLoading,
  onBack,
  onPublish,
}: Props) => {
  const active = images[activeIndex];
  const k = active?.file ? fileKey(active.file) : '';
  const edit = k ? edits[k] : null;
  const css = edit
    ? (FILTERS.find((f) => f.value === edit.filter)?.css ?? 'none')
    : 'none';

  if (!active || !edit) return null;

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

        <div className={s.headerTitle}>Publication</div>

        <button
          className={s.linkBtn}
          type="button"
          onClick={onPublish}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Publish'}
        </button>
      </div>

      <div className={clsx(s.body, s.publicationLayout)}>
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

        <div className={s.publicationPanel}>
          <div className={s.profileRow}>
            <div className={s.avatar}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : null}
            </div>
            <div className={s.profileName}>{profileName}</div>
          </div>

          <div>
            <div className={s.sectionLabel}>Add publication descriptions</div>
            <TextArea
              value={description}
              placeholder="Text-area"
              maxLength={500}
              rows={4}
              onChange={setDescription}
            />
          </div>

          <div className={s.divider} />

          {/* Location по ТЗ не реализуем */}
          <div style={{ opacity: 0.45 }}>
            <div className={s.sectionLabel}>Add location</div>
            <div
              style={{
                height: 44,
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
