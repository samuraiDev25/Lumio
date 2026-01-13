'use client';
import s from './ResultConfirm.module.scss';
import { Button } from '@/shared/ui';
import Image from 'next/image';

type Props = {
  title: string;
  subtitle: string;
  buttonText: string;
  onClickAction: () => void;
  imageSrc: string;
  imageAlt: string;
};

export function ResultConfirmation({
  title,
  subtitle,
  buttonText,
  onClickAction,
  imageSrc,
  imageAlt,
}: Props) {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>{title}</h1>
        <div className={s.subtitle}>
          <p>{subtitle}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={onClickAction}
          className={s.smallText}
        >
          {buttonText}
        </Button>
        <div className={s.illustration}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={400}
            priority
            className={s.illustrationImage}
          />
        </div>
      </div>
    </div>
  );
}
