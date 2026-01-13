/**
 * API функция для выхода из системы
 * @returns Promise с результатом выхода
 */
export const logoutUser = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const accessToken =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!accessToken) {
      return {
        success: false,
        error: "There is no access token in request",
      };
    }

    // Используем относительный путь для API запроса
    // В Next.js это может быть либо API route, либо прокси к бэкенду
    const response = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (response.status === 204) {
      // Успешный выход
      return { success: true };
    } else if (response.status === 401 || response.status === 500) {
      // Обработка ошибок API
      try {
        const errorData = await response.json();
        if (errorData?.errorMessages && Array.isArray(errorData.errorMessages) && errorData.errorMessages.length > 0) {
          return {
            success: false,
            error: errorData.errorMessages[0].message,
          };
        }
        return {
          success: false,
          error: 'An error occurred during logout',
        };
      } catch {
        return {
          success: false,
          error: 'An error occurred during logout',
        };
      }
    } else {
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

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

