'use client';

import { PasswordRecovery } from '@/features/auth/ui/passwordRecovery/PasswordRecovery';
import { RecaptchaProvider } from '../../providers/recaptcha-provider';

export default function ForgotPassword() {
  return (
    <div>
      <RecaptchaProvider>
        <PasswordRecovery />
      </RecaptchaProvider>
    </div>
  );
}
