import { Typography } from '@/shared/ui';
import s from '../../Search.module.scss';

type Props = {
  description: string;
};

export const SearchEmptyState = ({ description }: Props) => (
  <div className={s.emptyState}>
    <Typography color="secondary" variant="regular_text_14">
      Oops! This place looks empty!
    </Typography>
    <Typography color="secondary" variant="small_text">
      {description}
    </Typography>
  </div>
);
