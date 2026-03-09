import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  generalInformationSchema,
  GeneralInformationSchema,
} from '@/pages_fsd/profile/modal/validation';

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
