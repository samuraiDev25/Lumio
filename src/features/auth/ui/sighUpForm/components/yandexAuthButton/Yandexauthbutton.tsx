import { Button } from '@/shared/ui';
import SvgYandex from '@/shared/ui/icons/YandexSvg';

export const YandexAuthButton = () => {
  return (
    <Button type="button" variant="link" size="lg" fullWidth asChild>
      <a href="/api/v1/auth/yandex">
        <SvgYandex />
      </a>
    </Button>
  );
};
