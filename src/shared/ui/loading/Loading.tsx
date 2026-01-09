'use client';
import s from './Loading.module.scss';

export const Loading = () => {
  return (
    <div className={s.container}>
      <div className={s.spinner}></div>
      <p className={s.text}>Loading...</p>
    </div>
  );
};
