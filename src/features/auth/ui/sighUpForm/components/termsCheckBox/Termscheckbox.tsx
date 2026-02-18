import s from '@/features/auth/ui/sighUpForm/SignUpForm.module.scss';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Checkbox } from '@/shared/ui';
import Link from 'next/link';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { SignUpType } from '@/features/auth/model/validation';

type Props = {
  control: Control<SignUpType>;
  errors: FieldErrors<SignUpType>;
};
export const TermsCheckbox = ({ control, errors }: Props) => {
  return (
    <div className={s.checkBoxWrapper}>
      <Controller
        name="isAgree"
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChangeAction={field.onChange}
            className={s.checkBox}
            errorMessage={errors.isAgree?.message}
            label={
              <span className={s.label}>
                I agree to the{' '}
                <Link className={s.link} href={AUTH_ROUTES.TERMS_OF_SERVICE}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link className={s.link} href={AUTH_ROUTES.PRIVACY_POLICY}>
                  Privacy Policy
                </Link>
              </span>
            }
          />
        )}
      />
    </div>
  );
};
