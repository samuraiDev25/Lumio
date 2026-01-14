/**
 * Очистка всех данных авторизации из localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('email');
    // Очищаем возможные другие ключи, которые могут использоваться коллегами
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  }
};

/**
 * Получение email пользователя из localStorage
 */
export const getUserEmail = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userEmail') || localStorage.getItem('email') || '';
  }
  return '';
};

