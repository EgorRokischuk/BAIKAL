import { ErrorPageView } from './ui/ErrorPageView';

export const AccessDeniedPage = () => {
  return (
    <ErrorPageView
      code="401"
      title="Доступ ограничен"
      description="У вас нет прав для просмотра этой страницы. Вернитесь на главную и продолжите работу с доступными разделами."
    />
  );
};
