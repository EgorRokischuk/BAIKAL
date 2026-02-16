export const AppRole = {
  ADMIN: 'Администратор',
  AUTHORIZED: 'Авторизованный пользователь',
  UNAUTHORIZED: 'Неавторизованный пользователь',
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];
