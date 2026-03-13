import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  generalInformationSchema,
  GeneralInformationSchema,
} from '@/widgets/ProfileGeneralInfo/model/validation/validationSchema';

export function useGeneralInformationForm() {
  return useForm<GeneralInformationSchema>({
    resolver: zodResolver(generalInformationSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      aboutMe: '',
    },
  });
}
