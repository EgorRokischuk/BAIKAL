import { Box, Paper } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { selectProfile } from '@/store/slices/authSelectors';
import { GuideAssistantChat } from './GuideAssistantChat';
import styles from './GuidePage.module.scss';

export const GuidePage = () => {
  const profile = useAppSelector(selectProfile);
  const isAuthorized = Boolean(profile);

  return (
    <Box className={styles.page}>
      {isAuthorized && <GuideAssistantChat />}

      <Paper className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Руководство пользователя</h1>
          <p className={styles.subtitle}>
            Краткое руководство по работе с информационной системой «Байкал».
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Работа с готовыми продуктами (картами)</h2>
          <p className={styles.text}>
            Для отображения тематических карт задайте параметры в левой панели инструментов, во
            вкладке «Данные».
          </p>
          <h3 className={styles.sectionSubtitle}>
            Пример: построение карты температуры поверхности воды (LST)
          </h3>
          <ol className={styles.sectionList}>
            <li>Выберите вкладку «Готовые продукты» и категорию «LST».</li>
            <li>Выберите спутник (например, MODIS/Aqua).</li>
            <li>Укажите тип данных: дневные, ночные или среднесуточные.</li>
            <li>Выберите временной период.</li>
            <li>Нажмите кнопку «Показать слой».</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Генерация продуктов по запросу</h2>
          <p className={styles.text}>
            Для создания спутникового продукта в пользовательской области:
          </p>
          <ol className={styles.sectionList}>
            <li>Задайте полигон интереса в границах озера Байкал.</li>
            <li>
              Выберите конкретную дату или диапазон дат. Для диапазона система рассчитает
              усреднённое значение.
            </li>
            <li>Запустите обработку и дождитесь результата.</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Работа с наземными данными</h2>
          <ol className={styles.sectionList}>
            <li>Перейдите во вкладку «Наземные данные».</li>
            <li>Укажите период наблюдений (дата начала и дата окончания).</li>
            <li>Выберите параметр и источник данных.</li>
            <li>Нажмите «Показать точки» для отображения на карте.</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Учетные записи и права доступа</h2>
          <p className={styles.text}>
            В правом верхнем углу интерфейса расположено меню аккаунта. Через него доступны
            регистрация и авторизация.
          </p>
          <ul className={styles.list}>
            <li>
              <span className={styles.menuItemTitle}>Гостевой доступ.</span> Доступен просмотр
              готовых спутниковых продуктов и архивных наземных данных.
            </li>
            <li>
              <span className={styles.menuItemTitle}>Зарегистрированный пользователь.</span>
              {' '}Дополнительно доступны онлайн-расчёты и работа с личным профилем.
            </li>
            <li>
              <span className={styles.menuItemTitle}>Привилегированный пользователь.</span>
              {' '}Доступна выгрузка наземных данных в формате XLSX.
            </li>
          </ul>
        </section>
      </Paper>
    </Box>
  );
};
