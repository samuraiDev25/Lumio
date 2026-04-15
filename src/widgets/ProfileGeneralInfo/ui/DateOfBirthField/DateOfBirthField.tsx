import {
  Control,
  Controller,
  FieldErrors,
  UseFormTrigger,
} from 'react-hook-form';
import { DatePicker } from '@/shared/ui';
import { formatDateToLocalIso } from '@/shared/ui/datePicker/utilsDate';
import { parseDateString } from '@/widgets/ProfileGeneralInfo/model/utils/dateOfBirthUtil';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import { usePathname } from 'next/navigation';
import s from '@/widgets/ProfileGeneralInfo/ui/GeneralInformation.module.scss';
import Link from 'next/link';
import { GeneralInformationSchema } from '@/widgets/ProfileGeneralInfo/model/validation/validationSchema';

type Props = {
  control: Control<GeneralInformationSchema>;
  errors: FieldErrors<GeneralInformationSchema>;
  trigger: UseFormTrigger<GeneralInformationSchema>;
};
export function DateOfBirthField({ control, errors, trigger }: Props) {
  const pathname = usePathname();
  const privacyPolicyHref = `${AUTH_ROUTES.PRIVACY_POLICY}?returnTo=${encodeURIComponent(pathname)}`;
  return (
    <Controller
      name="dateOfBirth"
      control={control}
      render={({ field }) => {
        const selectedDate = parseDateString(field.value);
        return (
          <>
            <DatePicker
              className={s.formGroup}
              labelTitle={'Date of birth'}
              mode={'multiple'}
              allowPastDates
              captionLayout="dropdown"
              startMonth={new Date(1950, 0, 1)}
              endMonth={new Date(2026, 11, 1)}
              reverseYears
              value={selectedDate}
              onChangeAction={async (date) => {
                if (!date) {
                  field.onChange('');
                  await trigger('dateOfBirth');
                  return;
                }

                const iso = formatDateToLocalIso(date);
                field.onChange(iso);
                await trigger('dateOfBirth');
              }}
              errorMessage={errors.dateOfBirth?.message}
              errorNode={
                <>
                  {errors.dateOfBirth?.message}{' '}
                  <Link href={privacyPolicyHref} className={s.privacyLink}>
                    Privacy Policy
                  </Link>
                </>
              }
            />
          </>
        );
      }}
    />
  );
}
