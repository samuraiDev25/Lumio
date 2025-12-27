'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const RecaptchaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'body',
        nonce: undefined,
      }}
      container={{
        parameters: {
          badge: 'inline', // или 'bottomright', 'bottomleft', 'inline'
          theme: 'light', // или 'dark'
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

/*Использование
1. оборачиваете компонент  RecaptchaProvider
2. в компоненте используете хук useGoogleReCaptcha 
пример: const { executeRecaptcha } = useGoogleReCaptcha();
3. делаете проверку к примеру: 
if (!executeRecaptcha) {
    setError('reCAPTCHA не инициализирован');
    setLoading(false);
    return;
    }
4. получаете токен пример: const token = await executeRecaptcha('registration');
в скобках указывается action он описывает контекст действия пользователя
и возвращается при проверке токена на сервере
Важно: Action должен быть одинаковым при генерации токена (на фронтенде) и 
при его проверке (ожидаемое значение на бэкенде).
*/
