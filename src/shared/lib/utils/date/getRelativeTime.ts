type Locale = 'ru' | 'en';

const translations = {
  en: { now: 'Just now', min: 'min ago', h: 'h ago', d: 'd ago' },
  ru: { now: 'Только что', min: 'мин назад', h: 'ч назад', d: 'д назад' },
};

/**
 * Преобразует дату в относительную строку времени (напр., "22 min ago", "2 ч назад").
 * Поддерживает форматы Instagram: min, h, d.
 *
 * @param dateString - Дата в формате ISO или строковом представлении.
 * @param lang - Текущий язык приложения ('en' | 'ru'). По умолчанию 'en'.
 * @returns Строка с относительным временем или локализованная дата, если прошло > 7 дней.
 */
export const getRelativeTime = (
  dateString: string,
  lang: string = 'en',
): string => {
  const currentLang = (lang === 'ru' ? 'ru' : 'en') as Locale;
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  const t = translations[currentLang];

  if (diffInSeconds < 60) return t.now;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} ${t.min}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${t.h}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ${t.d}`;

  return postDate.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
