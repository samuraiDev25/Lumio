'use client';

import { useMemo, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Cropper from 'react-easy-crop';
import clsx from 'clsx';
import { toast } from 'react-toastify';

import s from '../CreatePostDialog.module.scss';

import { validateImageFile } from '../../../lib/image';
import { fileKey } from '../../../lib/keys';
import { ImageEditsMap } from '@/entities/post/model/types/types';
import {
  ALLOWED_TYPES,
  ASPECTS,
  INVALID_FILE_TEXT,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
} from '@/entities/post/model/types/constant';

type Props = {
  images: ImageListType;
  setImages: (list: ImageListType) => void;

  edits: ImageEditsMap;
  setEdits: (next: ImageEditsMap) => void;

  activeIndex: number;
  setActiveIndex: (i: number) => void;

  onBack: () => void;
  onNext: () => void;
};

const ensureEdit = (edits: ImageEditsMap, key: string): ImageEditsMap => {
  if (edits[key]) return edits;
  return {
    ...edits,
    [key]: { crop: { x: 0, y: 0 }, zoom: 1, aspect: 1, filter: 'none' },
  };
};

export const StepCrop = ({
  images,
  setImages,
  edits,
  setEdits,
  activeIndex,
  setActiveIndex,
  onBack,
  onNext,
}: Props) => {
  const [showAspect, setShowAspect] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const active = images[activeIndex];
  const activeFile = active?.file;
  const activeKey = activeFile ? fileKey(activeFile) : '';

  const activeEdit = activeKey
    ? (edits[activeKey] ?? {
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1,
        filter: 'none',
      })
    : null;

  const closeAll = () => {
    setShowAspect(false);
    setShowZoom(false);
    setShowGallery(false);
  };

  const onChange = (list: ImageListType) => {
    // validate
    for (const item of list) {
      if (item.file) {
        const ok = validateImageFile(
          item.file,
          MAX_FILE_SIZE_BYTES,
          ALLOWED_TYPES,
        );
        if (!ok) {
          toast.error(INVALID_FILE_TEXT);
          return;
        }
      }
    }

    setImages(list);

    // sync edits for new images
    let nextEdits = { ...edits };
    for (const it of list) {
      if (it.file) nextEdits = ensureEdit(nextEdits, fileKey(it.file));
    }
    // remove edits for deleted images
    const keysSet = new Set(
      list.filter((x) => x.file).map((x) => fileKey(x.file!)),
    );
    for (const k of Object.keys(nextEdits)) {
      if (!keysSet.has(k)) delete nextEdits[k];
    }
    setEdits(nextEdits);

    if (activeIndex >= list.length)
      setActiveIndex(Math.max(0, list.length - 1));
  };

  const dots = useMemo(
    () =>
      images.map((_, idx) => (
        <div
          key={idx}
          className={clsx(s.dot, idx === activeIndex && s.dotActive)}
        />
      )),
    [images, activeIndex],
  );

  if (!active || !activeEdit) return null;

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

        <div className={s.headerTitle}>Cropping</div>

        <button className={s.linkBtn} type="button" onClick={onNext}>
          Next
        </button>
      </div>

      <div className={s.body}>
        <div className={s.stageWrap} onClick={closeAll}>
          <div className={s.stage}>
            <div className={s.cropperFrame}>
              <Cropper
                image={active.data_url}
                crop={activeEdit.crop}
                zoom={activeEdit.zoom}
                aspect={activeEdit.aspect}
                onCropChange={(crop) =>
                  setEdits({ ...edits, [activeKey]: { ...activeEdit, crop } })
                }
                onZoomChange={(zoom) =>
                  setEdits({ ...edits, [activeKey]: { ...activeEdit, zoom } })
                }
                onCropComplete={(_, croppedAreaPixels) =>
                  setEdits({
                    ...edits,
                    [activeKey]: { ...activeEdit, croppedAreaPixels },
                  })
                }
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className={clsx(s.navArrow, s.navLeft)}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAll();
                    setActiveIndex(
                      activeIndex === 0 ? images.length - 1 : activeIndex - 1,
                    );
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAll();
                    setActiveIndex(
                      activeIndex === images.length - 1 ? 0 : activeIndex + 1,
                    );
                  }}
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

                <div className={s.dots}>{dots}</div>
              </>
            )}

            <div className={s.bottomControls}>
              <div className={s.controlsRow}>
                <div className={s.controlsLeft}>
                  <button
                    className={clsx(s.fab, showAspect && s.fabActive)}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAspect((v) => !v);
                      setShowZoom(false);
                      setShowGallery(false);
                    }}
                    aria-label="Aspect"
                  >
                    ⤢
                  </button>

                  <button
                    className={clsx(s.fab, showZoom && s.fabActive)}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowZoom((v) => !v);
                      setShowAspect(false);
                      setShowGallery(false);
                    }}
                    aria-label="Zoom"
                  >
                    🔍
                  </button>
                </div>

                <div className={s.controlsRight}>
                  <button
                    className={clsx(s.fab, showGallery && s.fabActive)}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGallery((v) => !v);
                      setShowAspect(false);
                      setShowZoom(false);
                    }}
                    aria-label="Gallery"
                  >
                    🖼️
                  </button>
                </div>
              </div>

              {showAspect && (
                <div className={s.popover} onClick={(e) => e.stopPropagation()}>
                  <div className={s.popoverTitleRow}>
                    <span>Original</span>
                    <span style={{ opacity: 0.75 }}>▢</span>
                  </div>

                  <div className={s.popoverList}>
                    {ASPECTS.map((a) => (
                      <button
                        key={a.label}
                        className={s.popoverItem}
                        type="button"
                        onClick={() =>
                          setEdits({
                            ...edits,
                            [activeKey]: { ...activeEdit, aspect: a.value },
                          })
                        }
                      >
                        <span
                          style={{
                            fontWeight:
                              activeEdit.aspect === a.value ? 700 : 400,
                          }}
                        >
                          {a.label}
                        </span>
                        <span
                          className={clsx(
                            s.checkbox,
                            activeEdit.aspect === a.value && s.checkboxOn,
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showZoom && (
                <div
                  className={s.popover}
                  style={{ width: 280 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={s.popoverTitleRow}>
                    <span>Zoom</span>
                    <button
                      type="button"
                      onClick={() => setShowZoom(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={activeEdit.zoom}
                    onChange={(e) =>
                      setEdits({
                        ...edits,
                        [activeKey]: {
                          ...activeEdit,
                          zoom: Number(e.target.value),
                        },
                      })
                    }
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {showGallery && (
                <div
                  className={s.galleryPopover}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={MAX_FILES}
                    acceptType={['jpg', 'jpeg', 'png']}
                    dataURLKey="data_url"
                  >
                    {({ onImageUpload, onImageRemove }) => (
                      <div className={s.galleryRow}>
                        {images.slice(0, 3).map((img, idx) => (
                          <div
                            key={idx}
                            className={clsx(
                              s.thumb,
                              idx === activeIndex && s.thumbActive,
                            )}
                            role="button"
                            tabIndex={0}
                            onClick={() => setActiveIndex(idx)}
                          >
                            <img
                              className={s.thumbImg}
                              src={img.data_url}
                              alt=""
                            />
                            <button
                              className={s.thumbX}
                              type="button"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                onImageRemove(idx);
                              }}
                              aria-label="Remove"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          className={s.addCircle}
                          type="button"
                          onClick={onImageUpload}
                          disabled={images.length >= MAX_FILES}
                          aria-label="Add"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </ImageUploading>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
