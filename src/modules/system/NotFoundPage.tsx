import { ErrorPageView } from './ui/ErrorPageView';

export const NotFoundPage = () => {
  return (
    <ErrorPageView
      code="404"
      title="Страница не найдена"
      description="Похоже, адрес введён неверно или страница была перемещена. Перейдите на главную и продолжите работу с сервисом."
    />
  );
};
