'use client';

import { PasswordRecovery } from '@/features/auth/ui/passwordRecovery/PasswordRecovery';
import { RecaptchaProvider } from '@/features/providers/recaptcha-provider';

export default function RecoveryPassword() {
  return (
    <div>
      <RecaptchaProvider>
        <PasswordRecovery />
      </RecaptchaProvider>
    </div>
  );
}
