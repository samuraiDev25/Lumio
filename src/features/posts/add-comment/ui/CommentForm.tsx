import s from './CommentForm.module.scss';
import { Button } from '@/shared/ui';
type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  onSubmitAction: () => void;
  placeholder?: string;
};
export const CommentForm = ({
  value,
  placeholder,
  onSubmitAction,
  onChangeAction,
}: Props) => {
  return (
    <div className={s.inputWrapper}>
      <input
        type="text"
        onChange={(e) => onChangeAction(e.target.value)}
        value={value}
        placeholder={placeholder}
        className={s.input}
      />
      <Button
        className={s.submitButton}
        variant={'link'}
        onClick={onSubmitAction}
        disabled={!value.trim()}
      >
        Publish
      </Button>
    </div>
  );
};
