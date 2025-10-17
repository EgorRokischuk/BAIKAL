import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ROUTES } from '@/shared/config/router/routes';

const PersonalArea: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Личный кабинет</h1>
      <p>Страница в разработке. Скоро здесь будет функционал личного кабинета.</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => navigate(ROUTES.appRoute)}
        >
          На главную
        </Button>
      </div>
    </div>
  );
};

export { PersonalArea };