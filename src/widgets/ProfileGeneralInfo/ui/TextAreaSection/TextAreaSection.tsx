import s from '@/widgets/ProfileGeneralInfo/ui/GeneralInformation.module.scss';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { TextArea } from '@/shared/ui';
import { ABOUT_ME_MAX } from '@/pages_fsd/profile/modal/constants';
import { GeneralInformationSchema } from '@/widgets/ProfileGeneralInfo/model/validation/validationSchema';
type Props = {
  control: Control<GeneralInformationSchema>;
  errors: FieldErrors<GeneralInformationSchema>;
};
export function TextAreaSection({ control, errors }: Props) {
  return (
    <div className={s.formGroup}>
      <Controller
        name="aboutMe"
        control={control}
        render={({ field }) => (
          <TextArea
            id="aboutMe"
            placeholder="Text-area"
            label={'About Me'}
            maxLength={ABOUT_ME_MAX}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.aboutMe?.message}
            className={`${s.textareaWrapper} ${errors.aboutMe ? s.invalid : ''}`}
            textareaClassName={s.textarea}
            containerClassName={s.textareaContainer}
          />
        )}
      />
    </div>
  );
}
