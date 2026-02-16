import { Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import styles from './ErrorPageView.module.scss';

type ErrorPageViewProps = {
  code: string;
  title: string;
  description: string;
};

export const ErrorPageView = ({ code, title, description }: ErrorPageViewProps) => {
  return (
    <section className={styles.container}>
      <Paper className={styles.card}>
        <span className={styles.code}>{code}</span>
        <Typography variant="h3" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body1" className={styles.description}>
          {description}
        </Typography>

        <div className={styles.actions}>
          <Button component={RouterLink} to={ROUTES.home} variant="contained" size="large">
            На главную
          </Button>
        </div>
      </Paper>
    </section>
  );
};
