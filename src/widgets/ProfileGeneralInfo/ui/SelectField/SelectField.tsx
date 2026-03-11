import s from '@/widgets/ProfileGeneralInfo/ui/GeneralInformation.module.scss';
import { UseFormRegister } from 'react-hook-form';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';

type Props = {
  name: keyof GeneralInformationSchema;
  label: string;
  options: string[];
  placeholder: string;
  register: UseFormRegister<GeneralInformationSchema>;
};

export function SelectField({
  name,
  register,
  label,
  options,
  placeholder,
}: Props) {
  return (
    <div className={s.formGroup}>
      <label className={s.label} htmlFor={name}>
        {label}
      </label>

      <div className={s.selectWrap}>
        <select
          id={name}
          {...register(name)}
          className={s.select}
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
