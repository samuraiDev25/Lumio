import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { normalizeDateString } from '@/widgets/ProfileGeneralInfo/modal/utils/dateOfBirthUtil';

export function mapProfileToForm(profile: UserProfile) {
  return {
    username: profile.username ?? '',
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    dateOfBirth: normalizeDateString(profile.dateOfBirth),
    country: profile.country ?? '',
    city: profile.city ?? '',
    aboutMe: profile.aboutMe ?? '',
  };
}
