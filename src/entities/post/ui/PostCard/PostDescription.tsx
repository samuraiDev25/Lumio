'use client';

import clsx from 'clsx';
import s from './PostCard.module.scss';

type PostDescriptionProps = {
  text: string;
  isExpanded: boolean;
  onToggle: (e: React.MouseEvent) => void;
};

const TRUNCATE_LIMITS = {
  SHORT: 95,
  LONG: 175,
  MIN_FOR_TOGGLE: 96,
};

/**
 * Post description component with smart text truncation.
 *
 * Features:
 * 1. Automatic truncation based on expanded/collapsed state.
 * 2. Conditional "Show more" button visibility.
 */
export const PostDescription = ({
  text,
  isExpanded,
  onToggle,
}: PostDescriptionProps) => {
  const shouldShowToggle = text.length > TRUNCATE_LIMITS.MIN_FOR_TOGGLE;

  const getDisplayText = () => {
    const currentLimit = isExpanded
      ? TRUNCATE_LIMITS.LONG
      : TRUNCATE_LIMITS.SHORT;

    if (text.length > currentLimit) {
      return `${text.substring(0, currentLimit)}...`;
    }

    return text;
  };

  return (
    <div className={clsx(s['text-container'], isExpanded && s.expanded)}>
      <span className={s.text}>{getDisplayText()}</span>

      {shouldShowToggle && (
        <button
          className={s['show-more']}
          onClick={onToggle}
          aria-label={isExpanded ? 'Hide full text' : 'Show more text'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Hide' : 'Show more'}
        </button>
      )}
    </div>
  );
};
